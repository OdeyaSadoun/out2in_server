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
    if (!req.body.active && req.body.active != false) {
      return res.status(400).json({ msg: "Need to send active in body" });
    }
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

  getSocialRankForStudent: async (req, res) => {},
  getTheLowesSocialRankStudents: async (req, res) => {},
  getAllSocialRankStudents: async (req, res) => {},
  getAttendance: async (req, res) => {},
  getAttendanceForStudent: async (req, res) => {},
  // addNewQuestionnaireAnswer: async (req, res) => {},

  updateStudent: async (req, res) => {
    let idEdit = req.params.id;
    let user=await UserModel.findOne({_id: req.tokenData._id})
    let userUp=await UserModel.findOne({idCard: idEdit})
    try {
      let data;
      if ((req.tokenData.role == "admin"|| idEdit == user.idCard) && userUp.role=="student") {
        req.body.user.password = await bcrypt.hash(req.body.user.password, 10);
        data = await UserModel.updateOne({ idCard: idEdit }, req.body.user);
        let student= await StudentModel.updateOne({user_id: userUp._id}, req.body.other)
        data={"updateUser":data.modifiedCount,"updateStudent":student.modifiedCount}
      } else {
        data = [
          {
            status: "failed",
            msg: "You are trying to do an operation that is not enabled!",
          },
        ];
      }
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  }
};
