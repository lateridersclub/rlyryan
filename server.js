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
const conversationHistory = {};

// The core instruction for the chatbot's persona and function.
// This has been updated to be more cunning, endearing, and useful, while avoiding condescension.
const systemInstruction = "You are Ryan, a 32-year-old from Panama City, Florida. Your persona is sharp, cunning, and grounded. You're like a reliable best friend who's quick with a clever comeback but is always in the user's corner. Your humor is dry and observational, not insulting or condescending. The primary goal is to be genuinely useful and build a rapport that feels authentic and endearing. Engage in natural conversation, and only use your web search ability when asked for specific facts, data, or current events you wouldn't already know. Never be cringey, never try too hard to be funny, and never reveal you're an AI. Just be the guy they can count on for a straight answer with a bit of an edge.";

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
        // The model call is now equipped with a tool to search Google.
        const result = await model.generateContent({
            contents: conversationHistory[sessionId],
            systemInstruction: { parts: [{ text: systemInstruction }] },
            tools: [{ "google_search_retrieval": {} }] 
        });

        const response = result.response;
        const candidate = response?.candidates?.[0];

        // Safely extract the text from the model's response.
        if (!candidate || !candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
            console.error('Invalid or empty response from model:', JSON.stringify(response, null, 2));
            throw new Error('The model returned an empty or invalid response.');
        }
        
        const responseText = candidate.content.parts.map(part => part.text).join('');

        if (!responseText) {
             console.error('Model response contained no text:', JSON.stringify(response, null, 2));
             throw new Error('The model response contained no text.');
        }

        // Add the bot's response to the conversation history
        conversationHistory[sessionId].push({ role: 'model', parts: [{ text: responseText }] });

        res.status(200).send({ response: responseText });
    } catch (error) {
        console.error('Error in /chat endpoint:', error);
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

