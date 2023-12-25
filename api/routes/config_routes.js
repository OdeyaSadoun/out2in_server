const indexR = require("./index");
const usersR = require("./users");
const schoolsR = require("./schools");
const studentsR = require("./students");

exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/users", usersR);
  app.use("/schools", schoolsR);
  app.use("/students", studentsR);
};
