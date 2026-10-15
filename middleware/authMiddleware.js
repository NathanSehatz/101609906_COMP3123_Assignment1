const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("Authentication failed: missing token");

      return res.status(401).json({
        message: "Authentication token is required"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      logger.warn("Authentication failed: user no longer exists");

      return res.status(401).json({
        message: "User no longer exists"
      });
    }

    req.user = user;

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      logger.warn("Authentication failed: invalid or expired token");

      return res.status(401).json({
        message: "Invalid or expired token"
      });
    }

    next(error);
  }
};

module.exports = protect;
