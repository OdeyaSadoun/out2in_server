const { SubjectsModel } = require("../models/subjects.model");
const { StudentModel } = require("../models/students.model");
const { TeacherModel } = require("../models/teachers.model");
const { ClassModel } = require("../models/classes.model");
const { UserModel } = require("../models/users.model");
const { TestModel } = require("../models/tests.model");

exports.testsCtrl = {
  GetTestsBalanceByStudentId: async (req, res) => {
    let gradesSum = 0;
    const studentId = req.params.studentId;
    let student_class;
    try {
      const student = await StudentModel.findOne({
        _id: studentId,
      }).populate("user_id", { password: 0 });

      student_class = await ClassModel.findOne({ _id: student.class_id })
        .populate("subjects_list");

      const subjects_list = student_class.subjects_list;
      await subjects_list.map(async (subject, i) => {
        let last_test_id = subject.tests_list.slice(-1);
        const last_test = await TestModel.findOne({ _id: last_test_id })
        const student_grade = last_test.grades_list.filter((grade) => {
          return String(grade.student_id) === String(studentId)
        });
        gradesSum += Number(student_grade[0].grade);
        if (i == 0) {
          console.log(gradesSum);
          res.json({ "gradesAvg": gradesSum/subjects_list.length })
        }
      })
    }
    catch (err) {
      console.log({ msg: "err", err });
    }
  },
  
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
