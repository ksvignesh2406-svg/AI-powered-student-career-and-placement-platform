const express = require("express");
const authorize = require("../middleware/roleMiddleware");
const authenticate=require("../middleware/authMiddleware");
const {
    register,
    login
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);
router.get("/test", authenticate, (req, res) => {
    res.json({
        success: true,
        message: "JWT authentication is working",
        user: req.user
    });
});
router.get(
    "/admin-test",
    authenticate,
    authorize("ADMIN"),
    (req, res) => {
        res.json({
            success: true,
            message: "Admin access granted",
            user: req.user
        });
    }
);
module.exports = router;