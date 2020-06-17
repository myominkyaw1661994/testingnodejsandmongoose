const mongoose = require("mongoose");
const config = require("config");
module.exports = function () {
  mongoose
    .connect(config.get("db"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`Connected to the ${config.get("db")}..`);
    })
    .catch(() => {
      console.log("Could not connect to mongodb");
    });
};
