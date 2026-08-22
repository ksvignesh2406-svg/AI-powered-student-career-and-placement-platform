const { GoogleGenAI } = require("@google/genai");

const generateAIResponse = async (messages) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured");
    }

    try {
        const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const systemMessage = messages.find((message) => message.role === "system")?.content || "";
        const conversation = messages
            .filter((message) => message.role !== "system")
            .map((message) => `${message.role === "assistant" ? "Assistant" : "User"}: ${message.content}`)
            .join("\n");
        const result = await client.models.generateContent({
            model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
            contents: conversation,
            config: { systemInstruction: systemMessage },
        });
        return result.text;
    } catch (error) {
        console.error("Gemini API error:", error.message);
        throw new Error("Failed to generate AI response: " + error.message);
    }
};

module.exports = { generateAIResponse };
