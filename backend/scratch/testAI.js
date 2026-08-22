const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./backend/.env" });

const testAI = async () => {
    // Generate a valid token
    const token = jwt.sign(
        { id: 1, role: "STUDENT" },
        process.env.JWT_SECRET || "my_super_secret_hackathon_key_123"
    );

    console.log("Token:", token);

    try {
        const response = await fetch("http://localhost:5000/api/ai/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                message: "hello",
                context: { attendance: "82%" }
            })
        });

        const data = await response.json();
        console.log("Response Status:", response.status);
        console.log("Response Data:", data);
    } catch (error) {
        console.error("Fetch Error:", error.message);
    }
};

testAI();
