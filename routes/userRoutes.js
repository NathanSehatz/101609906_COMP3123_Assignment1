const express = require("express");

const { authLimiter } = require("../middleware/rateLimiter");
const { signup, login } = require("../controllers/userController");

const {
  signupValidation,
  loginValidation,
  validate
} = require("../validators/userValidator");

const router = express.Router();

router.post("/signup", authLimiter, signupValidation, validate, signup);
router.post("/login", authLimiter, loginValidation, validate, login);

module.exports = router;
