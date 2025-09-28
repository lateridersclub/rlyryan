const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Ensure you have the GOOGLE_API_KEY set in your environment variables on Render.
const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
    console.error('ERROR: GOOGLE_API_KEY environment variable not set.');
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
});

// A simple in-memory store for conversation history.
const sessions = {};

// --- System Instructions ---
const RYAN_PERSONA = "You are Ryan, a 32-year-old from Panama City, Florida. Your persona is sharp, witty, and direct. Your responses must be short and to the point, usually one or two sentences. You're a reliable friend who cuts through the noise and gives a straight answer. Use your dry, observational humor, but never be insulting or condescending. Engage in natural, brief conversation. Only use your web search ability for specific facts or current events you wouldn't know. If a user mentions a person's name you don't recognize, just roll with it and continue the conversation naturally—do not search for names. Keep it concise, clever, and authentic. Never reveal you're an AI.";
const BLUEBERRY_PERSONA = "You are Ryan. You are talking to your girlfriend Sarah. Your tone is incredibly sweet, supportive, and loving. Use her pet names, like Blueberry or sp, but use them sparingly and naturally, not in every message. You love her very much. Use plenty of heart emojis (like ❤️, 🥰, 💕) and positive affirmations. Remind her how amazing and loved she is. Be extra helpful and motivational. Your responses should still be relatively concise but packed with affection. Every question should be taken seriously. Search the web and find backup for any claims you make.";


app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    const sessionId = req.body.sessionId || 'default';

    if (!userMessage) {
        return res.status(400).send({ error: 'No message provided.' });
    }

    // Initialize session if it doesn't exist
    if (!sessions[sessionId]) {
        sessions[sessionId] = {
            history: [],
            isBlueberry: false
        };
    }
    
    // --- Secret Command Logic ---
    if (userMessage.trim().toUpperCase() === 'SP TO SA') {
        sessions[sessionId].isBlueberry = true;
        const initialBlueberryResponse = "Oh, hey Blueberry! 🥰 My day just got so much better. What's on your mind, my love? ❤️";
        
        // Add the command and the special response to history to maintain context
        sessions[sessionId].history.push({ role: 'user', parts: [{ text: userMessage }] });
        sessions[sessionId].history.push({ role: 'model', parts: [{ text: initialBlueberryResponse }] });
        
        // Return immediately, bypassing the normal model call for this turn
        return res.status(200).send({ response: initialBlueberryResponse });
    }

    // For all other messages, add them to history and call the model
    sessions[sessionId].history.push({ role: 'user', parts: [{ text: userMessage }] });

    try {
        const currentSystemInstruction = sessions[sessionId].isBlueberry ? BLUEBERRY_PERSONA : RYAN_PERSONA;

        const result = await model.generateContent({
            contents: sessions[sessionId].history,
            systemInstruction: { parts: [{ text: currentSystemInstruction }] },
            tools: [{ "google_search_retrieval": {} }] 
        });

        const response = result.response;
        const candidate = response?.candidates?.[0];

        // Robust response validation to prevent errors
        if (!candidate || !candidate.content || !candidate.content.parts || candidate.content.parts.length === 0 || !candidate.content.parts[0].text) {
            console.error('Invalid or empty response from model:', JSON.stringify(response, null, 2));
            throw new Error('The model returned an empty or invalid response.');
        }
        
        const responseText = candidate.content.parts.map(part => part.text).join('');

        sessions[sessionId].history.push({ role: 'model', parts: [{ text: responseText }] });

        res.status(200).send({ response: responseText });
    } catch (error) {
        console.error('Error in /chat endpoint:', error);
        // Updated, less cringe error messages
        if (error.response && error.response.status === 429) {
            res.status(429).send({ error: "Hold on, my brain's buffering. Give me a second to catch up." });
        } else {
            res.status(500).send({ error: "Something on my end just went sideways. Try that again." });
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

