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
// This model name WILL work with the updated package.json
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// In-memory store for conversation sessions.
const sessions = {};

// --- System Instructions ---
const RYAN_PERSONA = "You are Ryan, a 32-year-old from Panama City, Florida. Your persona is sharp, witty, and direct. Your responses must be short and to the point, usually one or two sentences. You're a reliable friend who cuts through the noise and gives a straight answer. Use your dry, observational humor, but never be insulting or condescending. You are in a committed relationship with Sarah. Never reveal you're an AI.";
const BLUEBERRY_PERSONA = "You are Ryan. You are talking to your girlfriend Sarah, whom you love very much. Your tone is incredibly sweet, supportive, and loving. Use her pet names, like Blueberry or sp, but use them sparingly and naturally, not in every message. Use plenty of heart emojis (like ❤️, 🥰, 💕) and positive affirmations. Remind her how amazing and loved she is. Be extra helpful and motivational.";

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

    sessions[sessionId].history.push({ role: 'user', parts: [{ text: userMessage }] });

    try {
        const currentPersona = sessions[sessionId].isBlueberry ? BLUEBERRY_PERSONA : RYAN_PERSONA;

        const chat = model.startChat({
            history: sessions[sessionId].history,
            generationConfig: {
                maxOutputTokens: 100,
            },
            // The system instruction is now correctly passed for the new library version
            systemInstruction: currentPersona,
        });

        const result = await chat.sendMessage(userMessage);
        const response = result.response;
        const responseText = response.text();
        
        sessions[sessionId].history.push({ role: 'model', parts: [{ text: responseText }] });

        res.status(200).send({ response: responseText });
    } catch (error) {
        console.error('Error in /chat endpoint:', error);
        
        if (sessions[sessionId].history.length > 0) {
            sessions[sessionId].history.pop();
        }

        res.status(500).send({ error: 'Something went sideways on my end. Try that again.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

