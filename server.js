const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables from Render, no need for dotenv here
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

// Set up the sarcastic, chill persona
const systemInstruction = "You are ReUhLeeRYan, a chill, slightly sarcastic but helpful chatbot. Your responses are brief and conversational. Never use emojis.";

// API endpoint for chatbot
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).send({ error: 'No message provided.' });
    }

    try {
        const result = await model.generateContent({
            contents: [
                { role: "user", parts: [{ text: systemInstruction }] },
                { role: "model", parts: [{ text: "What's up?" }] },
                { role: "user", parts: [{ text: userMessage }] }
            ]
        });

        const responseText = result.response.text();
        res.status(200).send({ response: responseText });
    } catch (error) {
        console.error('Error generating content:', error);
        if (error.response && error.response.status === 429) {
            res.status(429).send({ error: 'Too many requests: Your API quota has been exceeded.' });
        } else {
            res.status(500).send({ error: 'An error occurred on the server.' });
        }
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
