const { ClassModel } = require("../models/classes.model");
const { StudentModel } = require("../models/students.model");
const { SubjectsModel } = require("../models/subjects.model");
const { TestModel } = require("../models/tests.model");
const { UserModel } = require("../models/users.model");

const getTestsBalanceByStudentId = async (studentId, class_id) => {
  let gradesSum1 = 0;
  let gradesCount1 = 0;
  let gradesSum2 = 0;
  let gradesCount2 = 0;
  let gradesSum3 = 0;
  let gradesCount3 = 0;

  try {
    const studentClass = await ClassModel.findOne({
      _id: class_id,
      active: "true",
    }).populate("subjects_list");

    const subjectsList = studentClass.subjects_list;

    for (const subject of subjectsList) {
      const lastTestsIds = subject.tests_list.slice(-3);

      for (const testId of lastTestsIds) {
        const test = await TestModel.findOne({ _id: testId, active: "true" });

        if (test) {
          const studentGrade = test.grades_list.find(
            (grade) => String(grade.student_id) === String(studentId)
          );

          if (studentGrade) {
            switch (lastTestsIds.indexOf(testId)) {
              case 0:
                gradesSum3 += Number(studentGrade.grade);
                gradesCount3++;
                break;
              case 1:
                gradesSum2 += Number(studentGrade.grade);
                gradesCount2++;
                break;
              case 2:
                gradesSum1 += Number(studentGrade.grade);
                gradesCount1++;
                break;
            }
          }
        }
      }
    }
    const avgGrades1 = gradesCount1 == 0 ? 0 : gradesSum1 / gradesCount1;
    const avgGrades2 = gradesCount2 == 0 ? 0 : gradesSum2 / gradesCount2;
    const avgGrades3 = gradesCount3 == 0 ? 0 : gradesSum3 / gradesCount3;
    console.log(avgGrades1, avgGrades2, avgGrades3);
    if (avgGrades3 < avgGrades2 && avgGrades2 < avgGrades1) {
      console.log("yes");
      return true;
    }
    return false;
  } catch (err) {
    console.log({ msg: "err", err });
    return { error: "Internal server error" };
  }
};

const deleteGradesByStudentId = async (studentId) => {
  try {
    const tests = await TestModel.find({
      "grades_list.student_id": studentId,
      active: true,
    });

    for (const test of tests) {
      const indexToRemove = test.grades_list.findIndex(
        (grade) => String(grade.student_id) === String(studentId)
      );

      if (indexToRemove !== -1) {
        test.grades_list.splice(indexToRemove, 1);
        await test.save();
      }
    }

    return { success: true, message: "Grades deleted successfully" };
  } catch (err) {
    console.log({ msg: "err", err });
    return { error: "Internal server error" };
  }
};

exports.testsCtrl = {
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

    try {
      let test = await TestModel.findOne({ _id: testId, active: true });
      if (!test) {
        return res.status(404).json({ msg: "Test not found" });
      }
      res.json(test);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  getTestsBalanceByClassId: async (req, res) => {
    const { classId } = req.params;

    try {
      const students = await StudentModel.find({
        class_id: classId,
        active: "true",
      }).populate("user_id", { password: 0 });

      if (!students || students.length === 0) {
        return res.status(404).json({ msg: "Students not found" });
      }

      let filterStudents = students.filter(item => item.user_id.active);

      const arr_balance = [];
      for (const student of filterStudents) {
        let studBalance = await getTestsBalanceByStudentId(
          student._id,
          classId
        );
        arr_balance.push({ student: student.user_id._id, down: studBalance });
      }

      res.json(arr_balance);
    } catch (err) {
      console.log({ msg: "err", err });
      res.status(500).json({ error: "Internal server error" });
    }
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
      console.log(newTest);
      await newTest.save();

      res.status(201).json(newTest);
    } catch (err) {
      res.status(500).json({ msg: "err", err });
    }
  },

  updateGrade: async (req, res) => {
    try {
      const testId = req.params.id;
      const { gradeIdToUpdate, updatedGradeValue } = req.body;

      if (!updatedGradeValue) {
        return res.status(400).json({ error: "Missing updated grade" });
      }

      const test = await TestModel.findOne({ _id: testId });

      if (!test) {
        return res.status(404).json({ error: "Test not found" });
      }

      let studUser = await UserModel.findOne({ idCard: gradeIdToUpdate });
      let stud = await StudentModel.findOne({ user_id: studUser._id });

      console.log(stud);
      console.log(test.grades_list);

      const indexToUpdate = test.grades_list.findIndex(
        (grade) => grade.student_id.toString() == stud._id.toString()
      );

      if (indexToUpdate === -1) {
        return res.status(404).json({ error: "Grade not found" });
      }

      test.grades_list[indexToUpdate].grade = updatedGradeValue;
      await test.save();

      res.json({ success: true, message: "Grade updated successfully" });
    } catch (error) {
      console.error("Error updating grade:", error);
      res.status(500).json({ error: "Internal server error" });
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

  deleteGradesByStudentId: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await UserModel.findOne({ idCard: id, active: true });
      if (!user) {
        return res.status(404).json({ msg: "user not found" });
      }
      
      const student = await StudentModel.findOne({
        user_id: user._id,
      }).populate("user_id", { password: 0 });
      if (!student) {
        return res.status(404).json({ msg: "student not found" });
      }

      const deletedGrades = await deleteGradesByStudentId(student._id);
      if (deletedGrades.error) {
        return res.status(500).json(deletedGrades);
      }

      res.json({
        success: true,
        message: "Student grades deleted successfully",
      });
    } catch (err) {
      console.log({ msg: "err", err });
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
