const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const { apiLimiter } = require("./middleware/rateLimiter");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emp", employeeRoutes);
app.use("/api", apiLimiter);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "COMP3123 Assignment 1 API is running"
  });
});

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();