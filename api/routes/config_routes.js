const indexR = require("./index");
const usersR = require("./users");
const schoolsR = require("./schools");

exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/users", usersR);
  app.use("/schools", schoolsR);
};
