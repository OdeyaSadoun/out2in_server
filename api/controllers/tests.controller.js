const { SubjectsModel } = require("../models/subjects.model");
const { StudentModel } = require("../models/students.model");
const { TeacherModel } = require("../models/teachers.model");
const { ClassModel } = require("../models/classes.model");
const { UserModel } = require("../models/users.model");
const { TestModel } = require("../models/tests.model");

exports.testsCtrl = {
  addGrade: async (req, res) => {
    let testId = req.params.testId;
    let studentId = req.body.studentId;
    let grade = req.body.grade;

    try {
      let test = await TestModel.findOne({ _id: testId });
      let studensGrades = test.grades_list.push({
        student_id: studentId,
        grade
      })

      let data = await TestModel.updateOne(
        { _id: testId },
        { $set: { grades_list: studensGrades } }
      );
      res.json(data);
    } catch (err) {
      res.json(err);
    }
  },
};
