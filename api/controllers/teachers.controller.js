const { TeacherModel } = require("../models/teachers.model");
const { userlCtrl } = require("../controllers/users.controller");
const { UserModel } = require("../models/users.model");
const { SchoolsModel } = require("../models/schools.model");


exports.teacherlCtrl = {
  getTeacherInfo: async (req, res) => {

    // res.json(req.userInfo)
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
      console.log(req.tokenData._id)
      let school = await SchoolsModel.findOne({ principal_id: req.tokenData._id });
      console.log("school", school)
      let data = await TeacherModel.find({});
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },


};

