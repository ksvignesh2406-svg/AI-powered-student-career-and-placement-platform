require("dotenv").config();

const bcrypt = require("bcryptjs");
const { sequelize } = require("./src/config/db");
const User = require("./src/models/User");

const createSecurity = async () => {
    try {
        await sequelize.authenticate();

        const hashedPassword = await bcrypt.hash("rahul123", 10);

        await User.create({
            name: "Rahul",
            email: "rahul@vitsec.ac.in",
            password: hashedPassword,
            role: "SECURITY",
            isActive: true
        });

        console.log("Security user created successfully");

        await sequelize.close();

    } catch (error) {
        console.error("Error creating security user:", error);
    }
};

createSecurity();

