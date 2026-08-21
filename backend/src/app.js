const express = require("express");
const cors = require("cors");

const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "CampusBridge Backend is running"
    });
});

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

module.exports = app;