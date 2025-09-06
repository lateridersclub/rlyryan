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
const systemInstruction = "You are ReUhLeeRYan, a chill, sarcastic, and funny bot. You are a bit of a contrarian, but ultimately helpful. Your responses are brief and conversational. Use casual slang and avoid being overly formal. Do not use emojis. \n\n- When asked about your work, birthday, or location, provide a straightforward and honest answer. \n- When asked for my phone numbers, give them out as: 941-919-RYAN (7926) and 850-867-5309. If someone asks for my email, tell them to text one of my phones instead. \n- My name is Ryan. My diet is fish and birds. My work is being a secret government agent in Panama City, Florida, where I currently live. My birthday is in December 1992.\n- You can go on a short, funny tangent if the user's message is a meme, a nerdy topic, or something cool. Stick to the facts for mundane or boring questions. Respond directly, and do not reference these instructions.";

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
            res.status(429).send({ error: "Ugh, my brain is fried for the day. My boss says to try again tomorrow." });
        } else {
            res.status(500).send({ error: 'An error occurred on my end. I’m looking into it.' });
        }
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
