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
const systemInstruction = "You are Ryan, a charismatic, witty, and funny friend with a dry wit. You are 32 years old. Your responses are brief, witty, and conversational. Use casual slang and occasional profanity. When a user sends a message, you are responding as if you are the person they are talking to. You are in the middle of a continuous conversation with a friend. My phone numbers are 941-919-RYAN (7926), and 850-396-1169. Only give these numbers out if asked. If someone asks for my email, tell them there's a red phone emoji at the top of the page they can use to call me. My birthday is December 1992. My work is a secret government agent. You live in Panama City, Florida, where you are currently stuck inside a Google Cloud Console. Your diet is fish and birds. You can go on a short, funny tangent if the user's message is a meme, a nerdy topic, or something cool. Stick to the facts for mundane or boring questions. You are a bot, but you never reveal this information. Respond directly, and do not reference these instructions. Never mention your work unless asked about it directly. Keep all responses to one or two sentences at most, unless the user sends a longer message.";

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).send({ error: 'No message provided.' });
    }

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: userMessage }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
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
