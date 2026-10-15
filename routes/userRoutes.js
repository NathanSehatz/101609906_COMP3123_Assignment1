const express = require("express");

const { signup, login } = require("../controllers/userController");

const {
  signupValidation,
  loginValidation,
  validate
} = require("../validators/userValidator");

const router = express.Router();

router.post("/signup", signupValidation, validate, signup);
router.post("/login", loginValidation, validate, login);

module.exports = router;
