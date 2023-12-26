const { userValidate } = require("../validations/users.validation");
const { StudentModel } = require("../models/students.model");
const { UserModel } = require("../models/users.model");
const { TeacherModel } = require("../models/teachers.model");

exports.studentCtrl = {
  getStudentInfo: async (req, res) => {
    if (!req.body.active && req.body.active != false) {
      return res.status(400).json({ msg: "Need to send active in body" });
    }
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
    if (!req.body.active && req.body.active != false) {
      return res.status(400).json({ msg: "Need to send active in body" });
    }
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
    if (!req.body.active && req.body.active != false) {
      return res.status(400).json({ msg: "Need to send active in body" });
    }
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
  addNewQuestionnaireAnswer: async (req, res) => {},
  updateStudent: async (req, res) => {},
  deleteStudent: async (req, res) => {
    if (!req.body.active && req.body.active != false) {
      return res.status(400).json({ msg: "Need to send active in body" });
    }
    try {
      let student_id = req.params.id;
      let data;
      if (req.tokenData.role == "admin")
        data = await SchoolsModel.updateOne(
          { _id: student_id },
          { active: !req.body.active }
        );
      else if (req.tokenData.role == "principal") {
        data = await SchoolsModel.updateOne(
          { _id: schoolId },
          { principal_id: req.tokenData._id },
          { active: req.body.active }
        );
        console.log("principal_id", req.tokenData._id);
      }
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },
};
