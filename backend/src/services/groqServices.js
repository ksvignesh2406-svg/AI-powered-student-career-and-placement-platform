const Groq = require("groq-sdk");

const generateAIResponse = async (messages) => {
    try {
        // Lazy init: read key at call-time (after dotenv.config() has run)
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });

        const completion = await groq.chat.completions.create({
            messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1000
        });

        return completion.choices[0].message.content;

    } catch (error) {
        console.error("Groq API error:", error.message);
        throw new Error("Failed to generate AI response: " + error.message);
    }
};

module.exports = {
    generateAIResponse
};
