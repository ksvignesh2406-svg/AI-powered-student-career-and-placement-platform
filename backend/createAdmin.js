require("dotenv").config();

const bcrypt = require("bcryptjs");
const { sequelize } = require("./src/config/db");
const User = require("./src/models/User");

const createAdmin = async () => {
    try {
        await sequelize.authenticate();

        const hashedPassword = await bcrypt.hash("Admin@12345", 10);

        await User.create({
            name: "CampusBridge Admin",
            email: "admin@campusbridge.com",
            password: hashedPassword,
            role: "ADMIN",
            isActive: true
        });

        console.log("Admin created successfully");

        await sequelize.close();

    } catch (error) {
        console.error("Error creating admin:", error);
    }
};

createAdmin();