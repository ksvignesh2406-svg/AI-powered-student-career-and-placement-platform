const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role
        } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Name, email, password and role are required"
            });
        }

        const allowedRoles = [
            "STUDENT",
            "FACULTY",
            "PARENT",
            "SECURITY",
            "ADMIN"
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        const existingUser = await User.findOne({
            where: { email: email.toLowerCase() }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: targetRole,
            isActive: true
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });

    } catch (error) {
        console.error("Create user error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create user"
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const { search, role } = req.query;
        const { Op } = require("sequelize");

        const whereClause = {};

        if (role && role !== "ALL") {
            const filterRole = role === "PLACEMENT" ? "PLACEMENT_OFFICER" : role.toUpperCase();
            whereClause.role = filterRole;
        }

        if (search && search.trim()) {
            const searchTerm = `%${search.trim().toLowerCase()}%`;
            whereClause[Op.or] = [
                { name: { [Op.like]: searchTerm } },
                { email: { [Op.like]: searchTerm } }
            ];
        }

        const users = await User.findAll({
            where: whereClause,
            attributes: ["id", "name", "email", "registerNumber", "role", "isActive", "createdAt"],
            order: [["createdAt", "DESC"]]
        });

        return res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error("Get users error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};

const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.isActive = typeof isActive === "boolean" ? isActive : !user.isActive;
        await user.save();

        return res.json({
            success: true,
            message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error("Toggle user status error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update user status"
        });
    }
};

module.exports = {
    createUser,
    getUsers,
    toggleUserStatus
};