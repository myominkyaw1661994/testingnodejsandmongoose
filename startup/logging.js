const logger = require("../log/logging");
require("express-async-errors");

module.exports = function () {
  process.on("uncaughtException", (ex) => {
    logger.log("error", ex.message);
    console.log(ex.message);
    // process.exit(1);
  });

  process.on("unhandledRejection", (ex) => {
    logger.log("error", ex.message);
    console.log("unhandle exception");
    process.exit(1);
  });
};
