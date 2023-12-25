const indexR = require("./index");
const usersR = require("./users");
const travelsR = require("./travels");

exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/users", usersR);
  app.use("/travels", travelsR);
};
