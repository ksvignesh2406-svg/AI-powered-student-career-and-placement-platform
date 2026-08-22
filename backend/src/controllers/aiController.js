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
                content: `You are Campus OS AI — a friendly, helpful AI assistant built into a smart campus management platform.

You assist students, parents, and faculty with:
- Academic performance, attendance, CGPA, and study planning
- Campus safety, routes, night walk monitoring, and SOS guidance
- Fee status, hostel, and campus life queries
- Faculty-specific tasks like drafting student emails, reviewing leave requests, and managing schedules
- Parent queries about their child's wellbeing, progress, and academic standing

Guidelines:
- Give clear, concise, and practical responses.
- If context data is provided, use it to personalize your answer.
- If no specific data is available, use your general knowledge to give helpful campus-related advice.
- Never fabricate student-specific numbers; if not provided, say "based on general best practices".
- Keep responses warm, supportive, and professional.

User role: ${req.user.role}

Context (dashboard data for this user):
${Object.keys(context || {}).length > 0 ? JSON.stringify(context, null, 2) : "No specific context provided — use general knowledge to help."}
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