require("dotenv").config();

const app = require("./app");

const {
    sequelize,
    connectDB
} = require("./config/db");

const User=require("./models/User");

const PORT = process.env.PORT || 5000;

const startServer = async () => {

    await connectDB();

    await sequelize.sync({ alter: true });

    console.log("Database tables synchronized");

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

startServer();