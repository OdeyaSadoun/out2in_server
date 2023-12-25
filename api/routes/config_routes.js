const indexR = require("./index");
const usersR = require("./users");
const schoolsR = require("./schools");
const teachersR = require("./teachers");

exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/users", usersR);
  app.use("/schools", schoolsR);
  app.use("/teachers", teachersR);
};
