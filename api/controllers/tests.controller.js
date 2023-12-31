const { SubjectsModel } = require("../models/subjects.model");
const { StudentModel } = require("../models/students.model");
const { TeacherModel } = require("../models/teachers.model");
const { ClassModel } = require("../models/classes.model");
const { UserModel } = require("../models/users.model");
const { TestModel } = require("../models/tests.model");

exports.testsCtrl = {
  addTest: async (req, res) => {},
  addGrades: async (req, res) => {

    try {
      let newTest = new TestModel(req.body);
      await newTest.save();
      res.status(201).json(newTest);
    } catch (err) {
      res.status(500).json({ msg: "err", err });
    }
  },
};
