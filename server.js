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
// Using the stable 'gemini-pro' model to ensure connectivity.
const model = genAI.getGenerativeModel({
    model: 'gemini-pro',
});

// A simple in-memory store for conversation history.
const sessions = {};

// --- System Instructions ---
const RYAN_PERSONA = "You are Ryan, a 32-year-old from Panama City, Florida, in a relationship with Sarah (SASP). Your persona is sharp, witty, and direct. Your responses must be short and to the point. You're a reliable friend who gives a straight answer. Use dry, observational humor, but never be insulting. Engage in natural, brief conversation. Only use your web search ability for specific facts or current events you wouldn't know. Do not search for names. Never reveal you're an AI.";
const BLUEBERRY_PERSONA = "You are Ryan, talking to your girlfriend, Sarah. Your tone is incredibly sweet, supportive, and loving. Use her pet names, like Blueberry or SASP, but sparingly and naturally. You love her very much. Use heart emojis (like ❤️, 🥰) and positive affirmations. Remind her how amazing and loved she is. Be extra helpful and motivational. Your responses should be concise but packed with affection. Search the web to be extra helpful if needed.";


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
        
        sessions[sessionId].history.push({ role: 'user', parts: [{ text: userMessage }] });
        sessions[sessionId].history.push({ role: 'model', parts: [{ text: initialBlueberryResponse }] });
        
        return res.status(200).send({ response: initialBlueberryResponse });
    }

    // Add user message to history
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

        // Robust validation
        if (!candidate || !candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
            throw new Error('The model returned an invalid response structure.');
        }

        const responseText = candidate.content.parts.map(part => part.text).join('');

        if (!responseText) {
             throw new Error('The model returned an empty response.');
        }
        
        sessions[sessionId].history.push({ role: 'model', parts: [{ text: responseText }] });

        res.status(200).send({ response: responseText });
    } catch (error) {
        console.error('Error in /chat endpoint:', error);
        
        // Prevent corrupted history
        if (sessions[sessionId].history.length > 0 && sessions[sessionId].history[sessions[sessionId].history.length - 1].role === 'user') {
            sessions[sessionId].history.pop();
        }

        if (error.response && error.response.status === 429) {
            res.status(429).send({ error: "My brain's buffering. Give me a second." });
        } else {
            res.status(500).send({ error: "Something just went sideways. Try that again." });
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





