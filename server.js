const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.status(400).json({ error: 'No message provided.' });
        }
        
        // This is where you MUST paste your personal Google API key.
        // Get one for free at https://aistudio.google.com/
        const genAI = new GoogleGenerativeAI("AIzaSyAnZImguHcqw3ULSO3FDYjbtphB_mllKUw"); 
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemInstruction = "You are ReUhLeeRYan, a chill, slightly sarcastic but helpful chatbot. Your responses are brief and conversational. Never use emojis.";

        const result = await model.generateContent({
            contents: [{
                role: "user",
                parts: [{ text: userMessage }]
            }],
            systemInstruction: {
                parts: [{ text: systemInstruction }]
            }
        });

        const responseText = result.response.text();
        res.status(200).json({ response: responseText });
    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).json({ error: 'Something went wrong on the server.' });
    }
});

app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
});
