require("dotenv").config({ override: true });

const bcrypt = require("bcryptjs");
const { sequelize } = require("./src/config/db");
const User = require("./src/models/User");

const createAdmin = async () => {
    try {
        await sequelize.authenticate();

        const hashedPassword = await bcrypt.hash("Admin@12345", 12);
        const [admin, created] = await User.findOrCreate({
            where: { email: "admin@campusbridge.com" },
            defaults: {
                name: "CampusBridge Admin",
                password: hashedPassword,
                role: "ADMIN",
                isActive: true
            }
        });
        if (!created) await admin.update({ name: "CampusBridge Admin", password: hashedPassword, role: "ADMIN", isActive: true });

        console.log(`Admin ${created ? "created" : "updated"} successfully`);

        await sequelize.close();

    } catch (error) {
        console.error("Error creating admin:", error);
    }
};

createAdmin();