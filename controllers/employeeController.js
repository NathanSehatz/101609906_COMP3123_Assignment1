const mongoose = require("mongoose");
const Employee = require("../models/Employee");
const logger = require("../utils/logger");

const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find({
      user: req.user._id
    });

    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      position: req.body.position,
      salary: req.body.salary,
      date_of_joining: req.body.date_of_joining,
      department: req.body.department,

      user: req.user._id
    });

    res.status(201).json({
      message: "Employee created successfully",
      employee
    });
  } catch (error) {
    next(error);
  }
};

const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.eid,
      user: req.user._id
    });

    if (!employee) {
      logger.warn("Employee access denied or employee not found", {
        userId: req.user._id.toString(),
        method: req.method,
        path: req.path
      });
    
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    res.status(200).json(employee);
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const allowedFields = [
      "first_name",
      "last_name",
      "email",
      "position",
      "salary",
      "date_of_joining",
      "department"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.hasOwn(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    const employee = await Employee.findOneAndUpdate(
      {
        _id: req.params.eid,
        user: req.user._id
      },
      { $set: updates },
      {
        new: true,
        runValidators: true
      }
    );

    if (!employee) {
      logger.warn("Employee access denied or employee not found", {
        userId: req.user._id.toString(),
        method: req.method,
        path: req.path
      });
    
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    res.status(200).json({
      message: "Employee updated successfully",
      employee
    });
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findOneAndDelete({
      _id: req.query.eid,
      user: req.user._id
    });

    if (!employee) {
      logger.warn("Employee access denied or employee not found", {
        userId: req.user._id.toString(),
        method: req.method,
        path: req.path
      });
    
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};
