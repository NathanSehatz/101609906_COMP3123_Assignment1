const { body, param, query, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const employeeValidation = [
  body("first_name")
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 }),

  body("last_name")
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 }),

  body("email")
    .isEmail()
    .normalizeEmail(),

  body("position")
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 }),

  body("salary")
    .isFloat({ min: 0 })
    .withMessage("Salary must be a non-negative number"),

  body("date_of_joining")
    .isISO8601({ strict: true })
    .withMessage("Enter a valid date in ISO format"),

  body("department")
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 }),

  body().custom((value) => {
    if (Object.hasOwn(value, "user")) {
      throw new Error("Employee ownership cannot be set by the client");
    }
    return true;
  })
];

const employeeIdParamValidation = [
  param("eid")
    .custom(value => mongoose.isObjectIdOrHexString(value))
    .withMessage("Invalid employee ID")
];

const employeeIdQueryValidation = [
  query("eid")
    .custom(value => mongoose.isObjectIdOrHexString(value))
    .withMessage("Invalid employee ID")
];

const validateEmployee = (req, res, next) => {
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
  employeeValidation,
  employeeIdParamValidation,
  employeeIdQueryValidation,
  validateEmployee
};
