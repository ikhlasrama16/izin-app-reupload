const express = require("express");
const router = express.Router();

const ctrl = require("../controller/authController");
const protect = require("../middleware/auth");

// Register
router.post("/register", ctrl.register);

// Login
router.post("/login", ctrl.login);

// Protected route
router.get("/findUser", protect, ctrl.getMe);

router.patch("/change-password", protect, ctrl.changePassword);

module.exports = router;
