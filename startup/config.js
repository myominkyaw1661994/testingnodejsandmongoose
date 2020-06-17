const config = require("config");

module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKye is not defined");
  } else {
    console.log("JWT Private key is setup successufully");
  }
};
