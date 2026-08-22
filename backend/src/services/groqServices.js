const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateAIResponse = async (messages) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({
            model: "gemini-3.6-flash",
        });

        // Extract system prompt and conversation history
        const systemMessage = messages.find((m) => m.role === "system");
        const conversationMessages = messages.filter((m) => m.role !== "system");

        // Build the full prompt: system context + user message
        const systemContext = systemMessage ? systemMessage.content : "";
        const userMessage = conversationMessages
            .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
            .join("\n");

        const fullPrompt = systemContext
            ? `${systemContext}\n\n${userMessage}`
            : userMessage;

        const result = await model.generateContent(fullPrompt);
        const response = result.response.text();

        return response;

    } catch (error) {
        console.error("Gemini API error:", error.message);
        throw new Error("Failed to generate AI response: " + error.message);
    }
};

module.exports = {
    generateAIResponse
};
