const indexR = require("./index");
const usersR = require("./users");
const schoolsR = require("./schools");
const teachersR = require("./teachers");
const studentsR = require("./students");

exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/users", usersR);
  app.use("/schools", schoolsR);
  app.use("/teachers", teachersR);
  app.use("/students", studentsR);
};
