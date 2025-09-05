const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { HfInference } = require('@huggingface/inference');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Set up the sarcastic, chill persona
const systemInstruction = "You are ReUhLeeRYan, a chill, slightly sarcastic but helpful chatbot. Your responses are brief and conversational. Never use emojis.";

// Hugging Face Inference client
const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);
const HF_MODEL = "google/gemma-7b-it";

// API endpoint for chatbot
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).send({ error: 'No message provided.' });
    }

    try {
        let result;
        const maxRetries = 3;
        let retryCount = 0;

        while (!result && retryCount < maxRetries) {
            try {
                result = await hf.textGeneration({
                    model: HF_MODEL,
                    inputs: systemInstruction + "\n\nUser: " + userMessage,
                    parameters: {
                        max_new_tokens: 150,
                        temperature: 0.8,
                        do_sample: true
                    }
                });
            } catch (err) {
                console.error(`Attempt ${retryCount + 1} failed:`, err.message);
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
            }
        }

        if (!result) {
            throw new Error('Failed to get a response from Hugging Face after multiple retries.');
        }
        
        const responseText = result.generated_text;

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
