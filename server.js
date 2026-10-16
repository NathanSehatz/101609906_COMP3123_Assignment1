const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

const connectDB = require("./config/db");
const logger = require("./utils/logger");

const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const { apiLimiter } = require("./middleware/rateLimiter");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  })
);

app.use(express.json());
app.use("/api", apiLimiter);

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emp", employeeRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "COMP3123 Assignment 1 API is running"
  });
});

app.use(notFound);
app.use(errorHandler);

if (!process.env.VERCEL) {
  const startServer = async () => {
    try {
      await connectDB();

      app.listen(PORT, () => {
        logger.info(`Server started on port ${PORT}`);
        console.log(`Server running on http://localhost:${PORT}`);
      });
    } catch (error) {
      logger.error(`Server startup failed: ${error.message}`);
      process.exit(1);
    }
  };

  startServer();
}

module.exports = app;