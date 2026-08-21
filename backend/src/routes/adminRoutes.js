const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createUser
} = require("../controllers/adminController");

const router = express.Router();

router.post(
    "/users",
    authenticate,
    authorize("ADMIN"),
    createUser
);

module.exports = router;