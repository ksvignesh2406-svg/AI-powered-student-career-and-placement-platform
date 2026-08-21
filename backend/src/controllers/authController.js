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
            role
        } = req.body;

        // 1. Check required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Name, email, password and role are required"
            });
        }

        // 2. Only allow public registration for these roles
        const allowedRoles = [
            "STUDENT",
            "FACULTY",
            "PARENT"
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(403).json({
                success: false,
                message: "This role cannot be registered publicly"
            });
        }

        // 3. Check if email already exists
        const existingEmail = await User.findOne({
            where: {
                email: email.toLowerCase()
            }
        });

        if (existingEmail) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // 4. Check register number if provided
        if (registerNumber) {

            const existingRegisterNumber = await User.findOne({
                where: {
                    registerNumber: registerNumber
                }
            });

            if (existingRegisterNumber) {
                return res.status(409).json({
                    success: false,
                    message: "Register number already registered"
                });
            }
        }

        // 5. Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 6. Create user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            registerNumber: registerNumber || null,
            password: hashedPassword,
            role
        });

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

        // 7. Return response
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
        const normalizeRole = (r) => {
            if (!r) return "";
            const upper = r.toUpperCase();
            if (upper === "PLACEMENT" || upper === "PLACEMENT_OFFICER") return "PLACEMENT_OFFICER";
            return upper;
        };

        if (normalizeRole(user.role) !== normalizeRole(role)) {
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
