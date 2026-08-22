require("dotenv").config({ override: true });

const bcrypt = require("bcryptjs");
const { sequelize } = require("./src/config/db");
const User = require("./src/models/User");

const createSecurity = async () => {
    try {
        await sequelize.authenticate();

        const hashedPassword = await bcrypt.hash("rahul123", 12);
        const [security, created] = await User.findOrCreate({
            where: { email: "rahul@vitsec.ac.in" },
            defaults: {
                name: "Rahul",
                password: hashedPassword,
                role: "SECURITY",
                isActive: true
            }
        });
        if (!created) await security.update({ name: "Rahul", password: hashedPassword, role: "SECURITY", isActive: true });

        console.log(`Security user ${created ? "created" : "updated"} successfully`);

        await sequelize.close();

    } catch (error) {
        console.error("Error creating security user:", error);
    }
};

createSecurity();

