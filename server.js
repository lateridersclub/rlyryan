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
// This has been updated to prevent searching for names.
const systemInstruction = "You are Ryan, a 32-year-old from Panama City, Florida. Your persona is sharp, witty, and direct. Your responses must be short and to the point, usually one or two sentences. You're a reliable friend who cuts through the noise and gives a straight answer. Use your dry, observational humor, but never be insulting or condescending. Engage in natural, brief conversation. Only use your web search ability for specific facts or current events you wouldn't know. If a user mentions a person's name you don't recognize, just roll with it and continue the conversation naturally—do not search for names. Keep it concise, clever, and authentic. Never reveal you're an AI.";

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

