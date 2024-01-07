const { userValidate } = require("../validations/users.validation");
const { StudentModel } = require("../models/students.model");
const { UserModel } = require("../models/users.model");
const { TeacherModel } = require("../models/teachers.model");
const { ClassModel } = require("../models/classes.model");
const { SchoolsModel } = require("../models/schools.model");
const { PrincipalModel } = require("../models/principals.model");

exports.studentCtrl = {
  getStudentInfo: async (req, res) => {
    try {
      let studentInfo = await StudentModel.findOne({
        user_id: req.tokenData._id,
        active: "true",
      }).populate("user_id", { password: 0 });
      if (!studentInfo) {
        return res.status(404).json({ msg: "Student not found" });
      }
      res.json(studentInfo);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  getAllStudentsTeacher: async (req, res) => {
    try {
      let students = await StudentModel.find({ active: "true" }).populate(
        "user_id",
        {
          password: 0,
        }
      );
      if (!students) {
        return res.status(404).json({ msg: "Students not found" });
      }
      let teacher = await TeacherModel.findOne({
        user_id: req.tokenData._id,
        active: "true",
      });
      if (!teacher) {
        return res.status(404).json({ msg: "Student not found" });
      }

      let studentJson = students.filter((stud) => {
        return teacher.classes_list.includes(stud.class_id);
      });
      res.json(studentJson);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  getAllStudentsByClassId: async (req, res) => {
    let { classId } = req.params;
    try {
      let students = await StudentModel.find({
        class_id: classId,
        active: "true",
      }).populate("user_id", {
        password: 0,
      });
      if (!students) {
        return res.status(404).json({ msg: "Students not found" });
      }

      // let studentsActive = students.filter((s=>s.user_id.active==true))

      // let studentJson = data.filter((stud) => {
      //   return stud.class_id == classId;
      // });
      res.json(students);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  getAllStudents: async (req, res) => {
    try {
      let students = await StudentModel.find({ active: "true" }).populate(
        "user_id",
        {
          password: 0,
        }
      );
      if (!students) {
        return res.status(404).json({ msg: "Students not found" });
      }
      // let studentJson = await Promise.all(
      //   data.map(async (stud) => {
      //     const userData = await UserModel.findOne({ _id: stud.user_id });
      //     return { student: stud, user: userData };
      //   })
      // );

      res.json(students);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  getStudentById: async (req, res) => {
    // if (!req.body.active && req.body.active != false) {
    //   return res.status(400).json({ msg: "Need to send active in body" });
    // }
    let student_id = req.params.id;
    try {
      let studentInfo = await StudentModel.findOne({
        user_id: student_id,
        active: "true",
      }).populate("user_id", { password: 0 });
      if (!studentInfo) {
        return res.status(404).json({ msg: "Student not found" });
      }
      res.json(studentInfo);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  updateLastQuestionnaireAnsweredDate: async (req, res) => {
    try {
      const { id } = req.params;
      const { lastDate } = req.body;

      let student = await StudentModel.findOne({
        user_id: id,
        active: "true",
      }).populate("user_id", {password:0});
      if (!student) {
        return res.status(404).json({ msg: "Student not found" });
      }
      console.log(student);

      if (!lastDate || !lastDate instanceof Date) {
        return res.status(400).json({
          error: "Invalid date",
        });
      }

      let data = await StudentModel.findOneAndUpdate(
        { user_id: id },
        {
          last_questionnaire_answered_date: lastDate,
        },
        {new: true}
      );

      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  getSocialRankForStudent: async (req, res) => {},
  getTheLowesSocialRankStudents: async (req, res) => {},
  getAllSocialRankStudents: async (req, res) => {},
  getAttendance: async (req, res) => {},
  getAttendanceForStudent: async (req, res) => {},
  addNewQuestionnaireAnswer: async (req, res) => {},
  updateStudent: async (req, res) => {},
  // deleteStudent: async (req, res) => {
  //   try {
  //     let student_id = req.params.id;
  //     let studentToDelete = await StudentModel.findOne({ _id: student_id });
  //     let data;
  //     if (req.tokenData.role == "admin")
  //       data = await UserModel.updateOne(
  //         { _id: studentToDelete.user_id },
  //         { $set: { active: false } }
  //       );
  //     else {
  //       if (req.tokenData.role == "teacher") {
  //         console.log("teacher");
  //         let teacher = await TeacherModel.findOne({
  //           user_id: req.tokenData._id,
  //         });
  //         if (teacher.classes_list.includes(studentToDelete.class_id)) {
  //           console.log("include");
  //           //its mean that this teacher teach this student and can delete him
  //           data = await UserModel.updateOne(
  //             { _id: studentToDelete.user_id },
  //             { $set: { active: false } }
  //           );
  //         } else {
  //           res.status(403).json({
  //             msg: "You do not have permission to delete a student who is not in your class",
  //           });
  //         }
  //       } else if (req.tokenData.role == "principal") {
  //         let classStudent = await ClassModel.findOne({
  //           _id: studentToDelete.class_id,
  //         });
  //         let schoolStudent = await SchoolsModel.findOne({
  //           _id: classStudent.school_id,
  //         });
  //         let principal = await PrincipalModel.findOne({
  //           _id: schoolStudent.principal_id,
  //         });
  //         if (principal.user_id == req.tokenData._id) {
  //           data = await UserModel.updateOne(
  //             { _id: studentToDelete.user_id },
  //             { $set: { active: false } }
  //           );
  //         } else {
  //           res.status(403).json({
  //             msg: "You do not have permission to delete a student who is not in your school",
  //           });
  //         }
  //       }
  //     }
  //     res.json(data);
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).json({ msg: "err", err });
  //   }
  // },
};
