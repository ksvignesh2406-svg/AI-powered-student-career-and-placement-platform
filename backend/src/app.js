const express = require("express");
const cors = require("cors");
const aiRoutes = require("./routes/aiRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: allowedOrigins.length ? allowedOrigins : true
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "CampusBridge Backend is running"
    });
});

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/ai", aiRoutes);

module.exports = app;
