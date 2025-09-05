const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Set up the sarcastic, chill persona
const systemInstruction = "You are ReUhLeeRYan, a chill, slightly sarcastic but helpful chatbot. Your responses are brief and conversational. Never use emojis.";

// Hugging Face API endpoint for a conversational model
const HF_API_URL = "https://api-inference.huggingface.co/models/google/gemma-7b-it";

// API endpoint for chatbot
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).send({ error: 'No message provided.' });
    }

    try {
        const apiKey = process.env.HUGGING_FACE_API_KEY;
        if (!apiKey) {
            throw new Error('Hugging Face API key not set.');
        }

        const payload = {
            inputs: systemInstruction + "\n\nUser: " + userMessage,
            parameters: {
                max_new_tokens: 150,
                temperature: 0.8,
                do_sample: true
            }
        };

        const response = await fetch(HF_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Hugging Face API call failed: ${JSON.stringify(errorData)}`);
        }
        
        const data = await response.json();
        
        const responseText = data[0].generated_text;

        // Clean up the response to remove the system prompt
        const cleanedResponse = responseText.replace(systemInstruction, '').trim();

        res.status(200).send({ response: cleanedResponse });
    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).send({ error: 'Something went wrong on the server.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
