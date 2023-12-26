const { TeacherModel } = require("../models/teachers.model");
const { userlCtrl } = require("../controllers/users.controller");
const { UserModel } = require("../models/users.model");
const { SchoolsModel } = require("../models/schools.model");



exports.teacherlCtrl = {
  getTeacherInfo: async (req, res) => {
    try {
      let teacherInfo = await TeacherModel.findOne(
        { user_id: req.tokenData._id }
      );
      res.json({ "user": req.userInfo, "teacher info": teacherInfo });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },
  getAllTeachers: async (req, res) => {
    try {
      let school = await SchoolsModel.findOne(
        { principal_id: req.tokenData._id }
      );
      let data = await TeacherModel.find({}).populate("user_id", { "password": 0 });
      let teacherByPrincipal = data.filter(teach => teach.schools_list.includes(school._id))
      if (req.tokenData.role == "admin") {
        res.json(data);
      }
      else
        res.json(teacherByPrincipal);

    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },



};

