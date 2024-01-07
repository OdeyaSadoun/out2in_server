const { SubjectsModel } = require("../models/subjects.model");
const { StudentModel } = require("../models/students.model");
const { TeacherModel } = require("../models/teachers.model");
const { ClassModel } = require("../models/classes.model");
const { UserModel } = require("../models/users.model");
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
    }
    res.json(class_balance_arr);
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






