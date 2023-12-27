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
      }).populate("user_id", { password: 0 });
      res.json(studentInfo);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },
  getAllStudentsTeacher: async (req, res) => {
    try {
      let data = await StudentModel.find({}).populate("user_id", {
        password: 0,
      });
      console.log(req.tokenData._id);
      let teacher = await TeacherModel.findOne({ user_id: req.tokenData._id });

      console.log(teacher);
      let studentJson = data.filter((stud) => {
        return teacher.classes_list.includes(stud.class_id);
      });
      console.log(studentJson);
      res.json(studentJson);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },
  getAllStudents: async (req, res) => {
    try {
      let data = await StudentModel.find({}).populate("user_id", {
        password: 0,
      });

      // let studentJson = await Promise.all(
      //   data.map(async (stud) => {
      //     const userData = await UserModel.findOne({ _id: stud.user_id });
      //     return { student: stud, user: userData };
      //   })
      // );
      console.log(data);
      res.json(data);
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
      }).populate("user_id", { password: 0 });
      res.json(studentInfo);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },
  getSocialRankForStudent: async (req, res) => { },
  getTheLowesSocialRankStudents: async (req, res) => { },
  getAllSocialRankStudents: async (req, res) => { },
  getAttendance: async (req, res) => { },
  getAttendanceForStudent: async (req, res) => { },
  addNewQuestionnaireAnswer: async (req, res) => { },
  updateStudent: async (req, res) => { },
  addSubject: async (req, res) => {
    try {
      let studentID = req.body.studentId;
      let subjectID = req.body.subjectId;

      let student = await StudentModel.findOne({ user_id: studentID })
      if (!student) {
        res.json({"mag":"Student does not exist"})
        return
      }
      let arrayS=student.subjects_list
      arrayS.push(subjectID)
      let data =await StudentModel.updateOne({user_id:studentID}, { $set: { "subjects_list": arrayS } })

res.json(data)
    }
    catch (err) {
res.status(400).json(err)
    }

  }
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
