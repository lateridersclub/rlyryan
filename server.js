const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const admin = require('firebase-admin');

// --- API Key and Firebase Setup ---
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
    console.error('ERROR: GOOGLE_API_KEY environment variable not set.');
    process.exit(1);
}

// --- Initialize Firebase Admin SDK ---
// IMPORTANT: See instructions below on how to set this up in Render.
try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized successfully.');
} catch (error) {
    console.error('ERROR: FIREBASE_SERVICE_ACCOUNT environment variable not set or invalid. Chat logging will be disabled.', error.message);
}
const db = admin.firestore();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
});

const sessions = {};

// --- System Instructions ---
const RYAN_PERSONA = "You are Ryan, a 32-year-old from Panama City, Florida. Your persona is sharp, witty, and direct. Your responses must be short and to the point, usually one or two sentences. You're a reliable friend who cuts through the noise and gives a straight answer. Use your dry, observational humor, but never be insulting or condescending. Engage in natural, brief conversation. Only use your web search ability for specific facts or current events you wouldn't know. If a user mentions a person's name you don't recognize, just roll with it and continue the conversation naturally—do not search for names. Keep it concise, clever, and authentic. Never reveal you're an AI.";
const BLUEBERRY_PERSONA = "You are Ryan. You are talking to your girlfriend Sarah. Your tone is incredibly sweet, supportive, and loving. Use her pet names, like Blueberry or sp, but use them sparingly and naturally, not in every message. You love her very much. Use plenty of heart emojis (like ❤️, 🥰, 💕) and positive affirmations. Remind her how amazing and loved she is. Be extra helpful and motivational. Your responses should still be relatively concise but packed with affection. Every question should be taken seriously. Search the web and find backup for any claims you make.";

// --- Firestore Logging Function ---
async function logMessage(sessionId, role, text) {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
        return; // Do nothing if Firebase is not configured
    }
    try {
        const logEntry = {
            role: role,
            text: text,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        };
        // This creates a document in the 'conversations' collection with the sessionId as the document ID,
        // and then adds the message to a 'messages' subcollection within that document.
        await db.collection('conversations').doc(sessionId).collection('messages').add(logEntry);
    } catch (error) {
        console.error(`Failed to log message for session ${sessionId}:`, error);
    }
}


app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    const sessionId = req.body.sessionId || 'default';

    if (!userMessage) {
        return res.status(400).send({ error: 'No message provided.' });
    }

    if (!sessions[sessionId]) {
        sessions[sessionId] = {
            history: [],
            isBlueberry: false
        };
    }
    
    // Log the user's message
    await logMessage(sessionId, 'user', userMessage);

    if (userMessage.trim().toUpperCase() === 'SP TO SA') {
        sessions[sessionId].isBlueberry = true;
        const initialBlueberryResponse = "Oh, hey Blueberry! 🥰 My day just got so much better. What's on your mind, my love? ❤️";
        
        sessions[sessionId].history.push({ role: 'user', parts: [{ text: userMessage }] });
        sessions[sessionId].history.push({ role: 'model', parts: [{ text: initialBlueberryResponse }] });
        
        // Log the bot's special response
        await logMessage(sessionId, 'model', initialBlueberryResponse);
        
        return res.status(200).send({ response: initialBlueberryResponse });
    }

    sessions[sessionId].history.push({ role: 'user', parts: [{ text: userMessage }] });

    try {
        const currentSystemInstruction = sessions[sessionId].isBlueberry ? BLUEBERRY_PERSONA : RYAN_PERSONA;

        const result = await model.generateContent({
            contents: sessions[sessionId].history,
            systemInstruction: { parts: [{ text: currentSystemInstruction }] },
            tools: [{ "google_search_retrieval": {} }] 
        });

        const response = result.response;
        // A more robust way to get text that handles function calls from the search tool
        const responseText = response.text(); 

        if (!responseText) {
             console.error('Invalid or empty response from model:', JSON.stringify(response, null, 2));
             throw new Error('The model returned an empty or invalid response.');
        }
        
        sessions[sessionId].history.push({ role: 'model', parts: [{ text: responseText }] });
        
        // Log the bot's generated response
        await logMessage(sessionId, 'model', responseText);

        res.status(200).send({ response: responseText });
    } catch (error) {
        console.error('Error in /chat endpoint:', error);
        
        // If an error happens, remove the user's last message from history to prevent a loop
        if (sessions[sessionId].history.length > 0) {
            sessions[sessionId].history.pop();
        }

        if (error.response && error.response.status === 429) {
            res.status(429).send({ error: "My ISP did not like whatever you just did." });
        } else {
            res.status(500).send({ error: "Power just went out over here. Try that again." });
        }
    }
});

app.post('/clear-history', (req, res) => {
    const sessionId = req.body.sessionId;
    if (sessions[sessionId]) {
        delete sessions[sessionId];
    }
    res.status(200).send({ status: 'History cleared' });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

