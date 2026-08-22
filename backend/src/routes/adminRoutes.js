const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createUser,
    getUsers,
    toggleUserStatus
} = require("../controllers/adminController");

const router = express.Router();

router.get(
    "/users",
    authenticate,
    authorize("ADMIN"),
    getUsers
);

router.post(
    "/users",
    authenticate,
    authorize("ADMIN"),
    createUser
);

router.patch(
    "/users/:id/status",
    authenticate,
    authorize("ADMIN"),
    toggleUserStatus
);

module.exports = router;