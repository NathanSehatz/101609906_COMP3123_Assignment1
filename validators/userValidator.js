const { body, validationResult } = require("express-validator");

const signupValidation = [
  body("username")
    .isString()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3-30 characters"),

  body("email")
    .isEmail()
    .withMessage("Enter a valid email")
    .normalizeEmail(),

  body("password")
    .isString()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain a number")
];

const loginValidation = [
    body("username")
      .optional()
      .isString()
      .notEmpty()
      .withMessage("Username must not be empty"),
  
    body("email")
      .optional()
      .isEmail()
      .withMessage("Enter a valid email"),
  
    body("password")
      .isString()
      .notEmpty()
      .withMessage("Password is required"),
  
    body().custom((value) => {
      if (!value.username && !value.email) {
        throw new Error("Username or email is required");
      }
  
      return true;
    })
  ];

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array()
    });
  }

  next();
};

module.exports = {
    signupValidation,
    loginValidation,
    validate
  };