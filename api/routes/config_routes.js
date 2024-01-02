const indexR = require("./index");
const usersR = require("./users");
const schoolsR = require("./schools");
const teachersR = require("./teachers");
const studentsR = require("./students");
const classesR = require("./classes");
const messagesR = require("./messages");
const subjectsR = require("./subjects");
const friendsR = require("./friends");
const testsR = require("./tests");


exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/users", usersR);
  app.use("/schools", schoolsR);
  app.use("/teachers", teachersR);
  app.use("/students", studentsR);
  app.use("/classes", classesR);
  app.use("/messages", messagesR);
  app.use("/subjects", subjectsR);
  app.use("/friends", friendsR);
  app.use("/tests", testsR);
};
