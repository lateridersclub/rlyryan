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
        const apiKey = req.body.apiKey; // This allows you to pass the API key securely

        if (!userMessage) {
            return res.status(400).json({ error: 'No message provided.' });
        }
        
        // This is where you would hard-code your API key if you don't want to pass it from the client.
        const genAI = new GoogleGenerativeAI(apiKey || 'YOUR_API_KEY_HERE'); 
        
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
