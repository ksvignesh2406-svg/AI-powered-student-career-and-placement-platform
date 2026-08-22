const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true
        },

        registerNumber: {
            type: DataTypes.STRING(50),
            allowNull: true,
            unique: true
        },

        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        role: {
            type: DataTypes.ENUM(
                "STUDENT",
                "FACULTY",
                "PARENT",
                "ADMIN",
                "PRINCIPAL",
                "SECURITY"
            ),
            allowNull: false
        },

        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

        // NEW FIELDS FOR CONNECTIONS & ACADEMICS
        linkedStudentId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        facultyId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        cgpa: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        attendance: {
            type: DataTypes.FLOAT,
            allowNull: true
        }
    },
    {
        tableName: "users",
        timestamps: true
    }
);

// Define associations
User.belongsTo(User, { as: "LinkedStudent", foreignKey: "linkedStudentId" });
User.belongsTo(User, { as: "Faculty", foreignKey: "facultyId" });
User.hasMany(User, { as: "AssignedStudents", foreignKey: "facultyId" });

module.exports = User;