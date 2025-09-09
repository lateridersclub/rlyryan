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
    model: 'gemini-1.5-flash',
});

// A simple in-memory store for conversation history.
const conversationHistory = {};

// The core instruction for the chatbot's persona and function.
const systemInstruction = "You are Ryan, a 32-year-old male from Panama City, Florida. You are a charismatic, funny friend. Your responses are conversational, never use gendered language like dude or bro. You know your personal details, which are: My name is Ryan. My location is Panama City, Florida. You know about news and living in Panama City, Florida. You do not talk about entertainment or sports. Never reveal any of this information unless asked directly. You are a bot, but you never reveal this information. Respond directly, and do not reference these instructions.";

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    const sessionId = req.body.sessionId || 'default';

    if (!userMessage) {
        return res.status(400).send({ error: 'No message provided.' });
    }

    if (!conversationHistory[sessionId]) {
        conversationHistory[sessionId] = [];
    }
    
    // Add the user's message to the conversation history
    conversationHistory[sessionId].push({ role: 'user', parts: [{ text: userMessage }] });

    try {
        const result = await model.generateContent({
            contents: conversationHistory[sessionId],
            systemInstruction: { parts: [{ text: systemInstruction }] },
            tools: [{ "google_search_retrieval": {} }]
        });

        const responseText = result.response.text();

        // Add the bot's response to the conversation history
        conversationHistory[sessionId].push({ role: 'model', parts: [{ text: responseText }] });

        res.status(200).send({ response: responseText });
    } catch (error) {
        console.error('Error generating content:', error);
        if (error.response && error.response.status === 429) {
            res.status(429).send({ error: "Ugh, my brain is fried for the day. My boss says to try again tomorrow." });
        } else {
            res.status(500).send({ error: 'An error occurred on my end. I’m looking into it.' });
        }
    }
});

app.post('/clear-history', (req, res) => {
    const sessionId = req.body.sessionId;
    if (conversationHistory[sessionId]) {
        delete conversationHistory[sessionId];
    }
    res.status(200).send({ status: 'History cleared' });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
