const { SubjectsModel } = require("../models/subjects.model");
const { TestModel } = require("../models/tests.model");

exports.testsCtrl = {
  getTestById: async (req, res) => {
    let { testId } = req.params;
    try {
      let data = await TestModel.findOne({ _id: testId });
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  getAllGradesByTestId: async (req, res) => {
    let { testId } = req.params;
    let perPage = Math.min(req.query.perPage, 10) || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || "date_created";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try {
      let tests = await TestModel.find({ _id: testId })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse });

      let testsFilter = tests.filter((test) => test.active);
      res.json(testsFilter);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  GetTestsBalanceByStudentId: async (req, res) => {
    let gradesSum = 0;
    const { studentId } = req.params;
    let student_class;
    try {
      const student = await StudentModel.findOne({
        _id: studentId,
      }).populate("user_id", { password: 0 });

      student_class = await ClassModel.findOne({
        _id: student.class_id,
      }).populate("subjects_list");

      const subjects_list = student_class.subjects_list;
      await subjects_list.map(async (subject, i) => {
        let last_test_id = subject.tests_list.slice(-1);
        const last_test = await TestModel.findOne({ _id: last_test_id });
        const student_grade = last_test.grades_list.filter((grade) => {
          return String(grade.student_id) === String(studentId);
        });
        gradesSum += Number(student_grade[0].grade);
        if (i == 0) {
          // console.log(gradesSum);
          res.json({ gradesAvg: gradesSum / subjects_list.length });
        }
      });
    } catch (err) {
      console.log({ msg: "err", err });
    }
  },

  addTestToSubject: async (req, res) => {
    const subId = req.params.subId;
    const testId = req.body.test_id;

    let subject = await SubjectsModel.findOne({ _id: subId });
    if (!subject) {
      return res.status(404).json({ msg: "Subject not found" });
    }
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

  deleteTest: async (req, res) => {
    try {
      const { testId } = req.params;
      const test = await TestModel.findOne({ _id: testId });
      if (!test) {
        return res.status(404).json({ msg: "Test not found" });
      }

      let data = await TestModel.updateOne(
        { _id: testId },
        { $set: { active: false } }
      );

      res.json(test);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Error", error: err.message });
    }
  },
};
