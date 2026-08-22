const { generateAIResponse } = require("../services/geminiServices");

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

        if (!process.env.GEMINI_API_KEY) {
            const lastUserMsg = message.toLowerCase();
            let mockResponse = "I am your AI Campus companion. (Mock Mode: Add GEMINI_API_KEY in backend/.env for real AI)";

            if (lastUserMsg.includes("attendance")) {
                mockResponse = `Based on your context, attendance is ${context.attendance || "82%"}. Keep attending classes to maintain eligibility!`;
            } else if (lastUserMsg.includes("exam") || lastUserMsg.includes("study") || lastUserMsg.includes("cgpa")) {
                mockResponse = `Your current CGPA is ${context.cgpa || "N/A"}. Dedicating 20-30 minutes per day to self-study is highly recommended.`;
            } else if (lastUserMsg.includes("mentor") || lastUserMsg.includes("teacher")) {
                mockResponse = `Your assigned faculty mentor is ${context.mentor || "Unassigned"}. Feel free to reach out to them during office hours.`;
            } else if (lastUserMsg.includes("route") || lastUserMsg.includes("safe") || lastUserMsg.includes("path")) {
                mockResponse = "Safe path recommended: Take the main walkway via the Admin block. Avoid darker corridors near Block D.";
            }

            return res.status(200).json({
                success: true,
                response: mockResponse
            });
        }

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