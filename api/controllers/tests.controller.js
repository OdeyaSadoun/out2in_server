const { SubjectsModel } = require("../models/subjects.model");
const { StudentModel } = require("../models/students.model");
const { TeacherModel } = require("../models/teachers.model");
const { ClassModel } = require("../models/classes.model");
const { UserModel } = require("../models/users.model");
const { TestModel } = require("../models/tests.model");

exports.testsCtrl = {
  addTestToSubject: async (req, res) => {
    const subId = req.params.subId;
    const testId = req.body.test_id;
 
    let subject = await SubjectsModel.findOne({ _id: subId });

    
    let data = await SubjectsModel.updateOne(
      { _id: subId },
      { $push: { tests_list: testId } }
    );
    console.log(data);
  },
  addGrades: async (req, res) => {
    console.log(req.body);
    try {
      let newTest = new TestModel(req.body);
      await newTest.save();

      res.status(201).json(newTest);
    } catch (err) {
      res.status(500).json({ msg: "err", err });
    }
  },
};
