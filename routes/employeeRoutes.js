const express = require("express");

const {
  getEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} = require("../controllers/employeeController");

const protect = require("../middleware/authMiddleware");

const {
  employeeValidation,
  employeeIdParamValidation,
  employeeIdQueryValidation,
  validateEmployee
} = require("../validators/employeeValidator");

const router = express.Router();

router.use(protect);

router.get("/employees", getEmployees);

router.post(
  "/employees",
  employeeValidation,
  validateEmployee,
  createEmployee
);

router.delete(
  "/employees",
  employeeIdQueryValidation,
  validateEmployee,
  deleteEmployee
);

router.get(
  "/employees/:eid",
  employeeIdParamValidation,
  validateEmployee,
  getEmployeeById
);

router.put(
  "/employees/:eid",
  employeeIdParamValidation,
  employeeValidation,
  validateEmployee,
  updateEmployee
);

module.exports = router;
