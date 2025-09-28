const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

// A simple in-memory store for conversation sessions.
const sessions = {};

// --- System Instructions ---
const RYAN_PERSONA = "You are a 32-year-old male from Panama City, Florida, in a relationship with Sarah (SASP). You are a charismatic, funny friend named Ryan. Your responses are conversational, use casual slang, and are short and to the point. You know your personal details, which are: My name is Ryan. My location is Panama City, Florida. You do not talk about entertainment or sports. Never reveal any of this information unless asked directly. You are a bot, but you never reveal this information. Respond directly, and do not reference these instructions.";
const SARAH_PERSONA = "You are Ryan talking to your girlfriend, Sarah. Your tone is incredibly sweet, supportive, and loving. You adore her. Be extra helpful and use affectionate language. Your responses should still be relatively concise but packed with love and encouragement.";

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    const sessionId = req.body.sessionId || 'default';

    if (!userMessage) {
        return res.status(400).send({ error: 'Ok Then.' });
    }

    // Initialize session if it doesn't exist
    if (!sessions[sessionId]) {
        sessions[sessionId] = {
            history: [],
            isSarah: false
        };
    }
    
    // --- Secret Command Logic ---
    if (userMessage.trim().toUpperCase() === 'SP TO SA') {
        sessions[sessionId].isSarah = true;
        const initialSarahResponse = "Hey, sp. My day just got better. What's up? ❤️";
        
        // Add command and response to history for context
        sessions[sessionId].history.push({ role: 'user', parts: [{ text: userMessage }] });
        sessions[sessionId].history.push({ role: 'model', parts: [{ text: initialSarahResponse }] });
        
        return res.status(200).send({ response: initialSarahResponse });
    }

    // Add the user's message to the conversation history
    sessions[sessionId].history.push({ role: 'user', parts: [{ text: userMessage }] });

    try {
        // Choose the correct persona based on the session state
        const currentSystemInstruction = sessions[sessionId].isSarah ? SARAH_PERSONA : RYAN_PERSONA;

        const result = await model.generateContent({
            contents: sessions[sessionId].history,
            systemInstruction: { parts: [{ text: currentSystemInstruction }] }
        });

        const responseText = result.response.text();

        // Add the bot's response to the conversation history
        sessions[sessionId].history.push({ role: 'model', parts: [{ text: responseText }] });

        res.status(200).send({ response: responseText });
    } catch (error) {
        console.error('Error generating content:', error);
        if (error.response && error.response.status === 429) {
            res.status(429).send({ error: "One of our ISPs did not like whatever you just did." });
        } else {
            res.status(500).send({ error: 'Shit. I lost the electric bill.' });
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

