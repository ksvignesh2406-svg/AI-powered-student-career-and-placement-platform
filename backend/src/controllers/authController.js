const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const {
            name,
            email,
            registerNumber,
            password,
            role,
            studentRegisterNumber
        } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Name, email, password and role are required"
            });
        }

        const allowedRoles = ["STUDENT", "FACULTY", "PARENT", "SECURITY"];

        if (!allowedRoles.includes(role)) {
            return res.status(403).json({
                success: false,
                message: "This role cannot be registered publicly"
            });
        }

        const existingEmail = await User.findOne({
            where: { email: email.toLowerCase() }
        });

        if (existingEmail) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        if (registerNumber) {
            const existingRegisterNumber = await User.findOne({
                where: { registerNumber }
            });
            if (existingRegisterNumber) {
                return res.status(409).json({
                    success: false,
                    message: "Register number already registered"
                });
            }
        }

        let linkedStudentId = null;
        let facultyId = null;
        let cgpa = null;
        let attendance = null;

        if (role === "PARENT") {
            if (!studentRegisterNumber) {
                return res.status(400).json({
                    success: false,
                    message: "Child's Register Number is required for Parent accounts"
                });
            }
            const linkedStudent = await User.findOne({
                where: { registerNumber: studentRegisterNumber, role: "STUDENT" }
            });
            if (!linkedStudent) {
                return res.status(404).json({
                    success: false,
                    message: "Could not find a student with that register number"
                });
            }
            linkedStudentId = linkedStudent.id;
        } else if (role === "STUDENT") {
            const faculties = await User.findAll({ where: { role: "FACULTY" } });
            if (faculties.length > 0) {
                const randomFaculty = faculties[Math.floor(Math.random() * faculties.length)];
                facultyId = randomFaculty.id;
            }
            cgpa = parseFloat((Math.random() * (10.0 - 6.0) + 6.0).toFixed(2));
            attendance = parseFloat((Math.random() * (100.0 - 70.0) + 70.0).toFixed(1));
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            registerNumber: registerNumber || null,
            password: hashedPassword,
            role,
            linkedStudentId,
            facultyId,
            cgpa,
            attendance
        });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                registerNumber: user.registerNumber,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }
};
const login = async (req, res) => {
    try {
        const {
            identifier,
            password,
            role
        } = req.body;

        // 1. Validate input
        if (!identifier || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Identifier, password and role are required"
            });
        }

        // 2. Find user by email OR register number
        const { Op } = require("sequelize");

        const user = await User.findOne({
            where: {
                [Op.or]: [
                    {
                        email: identifier.toLowerCase()
                    },
                    {
                        registerNumber: identifier
                    }
                ]
            }
        });

        // 3. User doesn't exist
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // 4. Check account is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated"
            });
        }

        // 5. Check selected role
        if (user.role?.toUpperCase() !== role?.toUpperCase()) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials or role"
            });
        }

        // 6. Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // 8. Send response
        res.status(200).json({
            success: true,
            message: "Login successful",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                registerNumber: user.registerNumber,
                role: user.role
            }
        });

    } catch (error) {

        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};

module.exports = {
    register,
    login
};
