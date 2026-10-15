const winston = require("winston");
const fs = require("fs");
const path = require("path");

const logDirectory = path.join(__dirname, "../logs");

fs.mkdirSync(logDirectory, { recursive: true });

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDirectory, "error.log"),
      level: "error"
    }),
    new winston.transports.File({
      filename: path.join(logDirectory, "combined.log")
    })
  ]
});

module.exports = logger;
