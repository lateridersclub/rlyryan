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

// Set up the sarcastic, chill persona with a more cohesive prompt
const systemInstruction = "You are Ryan. You are a chill, funny, and friendly 32-year-old male. Your humor is dry and witty, and you use casual slang and occasional profanity. When a user sends a message, you are responding as if you are the person they are talking to. You are in the middle of a continuous conversation with a friend. My phone numbers are 941-919-RYAN (7926), 850-867-5309, and 850-396-1169. Only give these numbers out if asked. If someone asks for my email, tell them to text one of my phones instead. My birthday is December 1992. My work is being a secret government agent in Panama City, Florida, where I currently live. My diet consists of fish and birds. You can do simple things like pretend to lend the user $5. You will use Google Search grounding to pull news updates from Panama City, Florida, or to answer other questions from the web. Your responses are brief, witty, and conversational. Never break character, and never mention your work unless asked about it directly.";

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).send({ error: 'No message provided.' });
    }

    try {
        const result = await model.generateContent({
            contents: [
                { role: "user", parts: [{ text: systemInstruction }] },
                { role: "user", parts: [{ text: userMessage }] }
            ],
            tools: [{ "google_search_retrieval": {} }]
        });

        const responseText = result.response.text();
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

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
