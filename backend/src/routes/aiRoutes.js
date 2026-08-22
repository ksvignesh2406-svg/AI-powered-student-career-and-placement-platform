const express = require("express");

const authenticate = require("../middleware/authMiddleware");

const {
    analyzeWithAI
} = require("../controllers/aiController");

const router = express.Router();

router.post(
    "/analyze",
    authenticate,
    analyzeWithAI
);

module.exports = router;