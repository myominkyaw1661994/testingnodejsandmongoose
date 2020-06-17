const winston = require("winston");

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: "logger.log", level: "error" }),
    new winston.transports.Console(),
  ],
});

module.exports = logger;
