const { SubjectsModel } = require("../models/subjects.model");
const { TestModel } = require("../models/tests.model");


const getTestsBalanceByStudentId1 = async (studentId,class_id) => {
  let gradesSum1 = 0;
  let gradesSum2 = 0;
  let gradesSum3 = 0;

  try {
    // const student = await StudentModel.findOne({ _id: studentId }).populate("user_id", { password: 0 });
    const studentClass = await ClassModel.findOne({ _id: class_id }).populate("subjects_list");
    const subjectsList = studentClass.subjects_list;

    for (const subject of subjectsList) {
      const lastTestsIds = subject.tests_list.slice(-3);

      for (const testId of lastTestsIds) {
        const test = await TestModel.findOne({ _id: testId, active: true });

        if (test) {
          const studentGrade = test.grades_list.find((grade) => String(grade.student_id) === String(studentId));

          if (studentGrade) {
            switch (lastTestsIds.indexOf(testId)) {
              case 0:
                gradesSum1 += Number(studentGrade.grade);
                break;
              case 1:
                gradesSum2 += Number(studentGrade.grade);
                break;
              case 2:
                gradesSum3 += Number(studentGrade.grade);
                break;
            }
          }
        }
      }
    }

    const subjectsCount = subjectsList.length > 0 ? subjectsList.length : 1; // To avoid division by zero
    const avgGrades1 = gradesSum1 / subjectsCount;
    const avgGrades2 = gradesSum2 / subjectsCount;
    const avgGrades3 = gradesSum3 / subjectsCount;
    if (avgGrades1 > avgGrades2 > avgGrades3)
      return true;
    else
      return false
    // return { gradesAvg1: avgGrades1, gradesAvg2: avgGrades2, gradesAvg3: avgGrades3 };
  } catch (err) {
    console.log({ msg: "err", err });
    return { error: "Internal server error" };
  }
}

exports.testsCtrl = {
  getTestsBalanceByStudentId: async (req, res) => {

    const classId = req.params.classId;
    const classStudents = await StudentModel.find({ class_id: classId });
    const class_balance_arr = [];
    for (const student of classStudents) {
      let avg = await getTestsBalanceByStudentId1(student._id,classId)
      class_balance_arr.push({ srudent_id: student._id, avg: avg });

  getTestById: async (req, res) => {
    let { testId } = req.params;
    try {
      let data = await TestModel.findOne({ _id: testId, active: "true" });
      if (!data) {
        return res.status(404).json({ msg: "Test not found" });
      }
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
      let test = await TestModel.findOne({ _id: testId, active: "true" })
     console.log("aaa", test);
      if (!test) {
        return res.status(404).json({ msg: "Test not found" });
      }
      // let testsFilter = tests.filter((test) => test.active);
      res.json(test);
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
        active: "true",
      }).populate("user_id", { password: 0 });
      if (!student) {
        return res.status(404).json({ msg: "Student not found" });
      }
      student_class = await ClassModel.findOne({
        _id: student.class_id,
        active: "true",
      }).populate("subjects_list");
      if (!student_class) {
        return res.status(404).json({ msg: "Class not found" });
      }

      const subjects_list = student_class.subjects_list;
      await subjects_list.map(async (subject, i) => {
        let last_test_id = subject.tests_list.slice(-1);
        const last_test = await TestModel.findOne({
          _id: last_test_id,
          active: "true",
        });
        if (!last_test) {
          return res.status(404).json({ msg: "Test not found" });
        }
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
    res.json(class_balance_arr);
  },

  addTestToSubject: async (req, res) => {
    const { subId } = req.params;
    const testId = req.body.test_id;

    let subject = await SubjectsModel.findOne({ _id: subId, active: "true" });
    if (!subject) {
      return res.status(404).json({ msg: "Subject not found" });
    }
    let data = await SubjectsModel.updateOne(
      { _id: subId, active: "true" },
      { $push: { tests_list: testId } }
    );
    console.log(data);
  },

  addGrades: async (req, res) => {
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
      const test = await TestModel.findOne({ _id: testId, active: "true" });
      if (!test) {
        return res.status(404).json({ msg: "Test not found" });
      }

      let data = await TestModel.updateOne(
        { _id: testId, active: "true" },
        { $set: { active: false } }
      );

      res.json(test);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Error", error: err.message });
    }
  },
};
