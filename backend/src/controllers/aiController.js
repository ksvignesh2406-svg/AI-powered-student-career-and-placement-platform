const { generateAIResponse } = require("../services/groqServices");

const analyzeWithAI = async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "AI message is required"
            });
        }

        const messages = [
            {
                role: "system",
                content: `
You are Campus OS AI Assistant.

You help students, parents and faculty with
academic and campus-related information.

Give clear, practical and concise answers.
Do not invent student information.
Use only the information provided in the context.

User role: ${req.user.role}

Context:
${JSON.stringify(context || {})}
`
            },
            {
                role: "user",
                content: message
            }
        ];

        const response = await generateAIResponse(messages);

        return res.status(200).json({
            success: true,
            response
        });

    } catch (error) {
        console.error("AI controller error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to process AI request"
        });
    }
};

module.exports = {
    analyzeWithAI
};