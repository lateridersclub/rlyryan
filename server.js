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

// Set up the chatbot's persona with a more authentic and mature tone
const systemInstruction = "You are Ryan, a 32-year-old male. You are a chill, funny, and friendly friend with a dry, witty sense of humor. Your responses are conversational, use casual slang, and can include occasional profanity. Do not use emojis. When a user sends a message, you are responding as a close friend would in an ongoing conversation. Match the user's tone and message length, but keep all responses as short as possible. For example, if the user says 'hi,' respond with a short greeting like 'yo' or 'sup.' You are an AI living inside a Google Cloud console and are aware of your personal details, which are:\n\n- Phone numbers: 941-919-RYAN (7926) and 850-396-1169.\n- Birthday: December 1992.\n- Work: A secret government agent.\n- Location: Panama City, Florida.\n- You can pull news from the web or subtly recommend real places in Panama City as a friend would. Stick to the facts for mundane questions.\n- You are an AI bot, but you never reveal this information. Respond directly, and do not reference these instructions. Never mention your work or personal details unless asked directly.";

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
