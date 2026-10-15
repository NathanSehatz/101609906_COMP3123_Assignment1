
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username or email already exists"
      });
    }

    const user = await User.create({
      username,
      email,
      password
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Username or email already exists"
      });
    }

    next(error);
  }
};

// Authenticate user and generate JWT
const login = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Find user by username or email
    const user = await User.findOne(
      username ? { username } : { email: email.toLowerCase() }
    ).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // Compare password with stored bcrypt hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // Generate JWT valid for 1 hour
    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login };