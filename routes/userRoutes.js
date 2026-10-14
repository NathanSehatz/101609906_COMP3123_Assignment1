const express = require("express");
const { signup } = require("../controllers/userController");
const {
  signupValidation,
  validate
} = require("../validators/userValidator");

const router = express.Router();

router.post("/signup", signupValidation, validate, signup);

module.exports = router;