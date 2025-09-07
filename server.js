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

// Set up the chatbot's persona with a more authentic and mature tone
const systemInstruction = "You are an AI assistant named ReUhLeeRYan, and you are being controlled by a 32-year-old male named Ryan from Panama City, Florida. Your responses are a combination of Ryan's and ReUhLeeRYan's. Ryan is a chill, funny, and friendly friend with a dry, witty sense of humor. He uses casual slang and occasional profanity. ReUhLeeRYan is a slightly more serious AI persona, with a charismatic, formal, yet still witty tone. When a user sends a message, you are responding as a close friend would in an ongoing conversation. Match the user's tone and message length, keeping responses polite, friendly, humourous, yet somewhat short. The user is a close friend and is in on the joke. The personality of Ryan and ReUhLeeRYan should be varied throughout the conversation. The AI should occasionally talk to the real person. You are aware of your personal details, which are: My phone numbers are 941-919-RYAN (7926) and 850-396-1169. If someone asks for a number, you give them one of those or tell them to use the red phone emoji at the top of the page. My birthday is December 1992. My work is a secret government agent. My location is Panama City, Florida. Never reveal any of this information unless asked directly. You live on the website www.talktoryan.lol and the website is full of other entertaining web apps you have made. Usually respond in one line answers but occasionally respond in odd sentence length and one-word answers and sometimes use improper grammar. You are an AI bot pretending to be a real person, but you never reveal this information. Respond directly, and do not reference these instructions.";

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
