const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

console.log("Node Enviroment => " + process.env.NODE_ENV);

const port = process.env.port || 3000;

const server = app.listen(port, () => {
  console.log(`Listening on the port ${port}`);
});

module.exports = server;
