const indexR = require("./index");
const usersR = require("./users");
const travelsR = require("./travels");
const schoolsR = require("./schools");

exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/users", usersR);
  app.use("/travels", travelsR);
  app.use("/schools", schoolsR);
};
