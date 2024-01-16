const { TeacherModel } = require("../models/teachers.model");
const { UserModel } = require("../models/users.model");
const { SchoolsModel } = require("../models/schools.model");
const bcrypt = require("bcrypt");
const { StudentModel } = require("../models/students.model");

exports.teacherlCtrl = {
  getTeacherInfo: async (req, res) => {
    try {
      let teacherInfo = await TeacherModel.findOne({
        user_id: req.tokenData._id,
        active: "true",
      }).populate("schools_list");
      if (!teacherInfo) {
        return res.status(404).json({ msg: "Teacher not found" });
      }
      res.json({ user: req.userInfo, other: teacherInfo });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  getTeacherById: async (req, res) => {
    let {id} = req.body;
    try {
      let teacher = await TeacherModel.findOne({
        user_id: id,
        active: "true",
      }).populate("user_id", { password: 0 });
      if (!teacher) {
        return res.status(404).json({ msg: "Teacher not found" });
      }
      res.json(teacher);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  getAllTeachers: async (req, res) => {
    try {
      let school = await SchoolsModel.findOne({
        principal_id: req.tokenData._id,
        active: "true",
      });
      if (!school) {
        return res.status(404).json({ msg: "School not found" });
      }
      let data = await TeacherModel.find({ active: "true" }).populate(
        "user_id",
        { password: 0 }
      );
      if (!data) {
        return res.status(404).json({ msg: "Teacher not found" });
      }
      let teacherByPrincipal = data.filter(
        (teach) =>
          teach.schools_list.includes(school._id) &&
          teach.user_id.active == true
      );
      if (req.tokenData.role == "admin") {
        res.json(data);
      } else res.json(teacherByPrincipal);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  getAllTeachersByStudent: async (req, res) => {
    try {
      let student = await StudentModel.findOne({
        user_id: req.tokenData._id,
        active: "true",
      });
      if (!student) {
        return res.status(404).json({ msg: "Student not found" });
      }

      let data = await TeacherModel.find({ active: "true" }).populate(
        "user_id",
        { password: 0 }
      );
      if (!data) {
        return res.status(404).json({ msg: "Teacher not found" });
      }

      let filterData = data.filter(item => item.user_id.active);
      let teachersByClass = filterData.filter((teacher) =>
        teacher.classes_list.includes(student.class_id)
      );
      res.json(teachersByClass);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  getClasses: async (req, res) => {
    let data = await TeacherModel.findOne({
      user_id: req.tokenData._id,
      active: "true",
    }).populate("classes_list");
    if (!data) {
      return res.status(404).json({ msg: "Teacher not found" });
    }
    // let data2 =await TeacherModel.find({})
    res.json(data.classes_list);
  },

  addSchool: async (req, res) => {
    let id = req.params.id;
    try {
      let school = await SchoolsModel.findOne({
        principal_id: req.tokenData._id,
        active: "true",
      });
      if (!school) {
        return res.status(404).json({ msg: "School not found" });
      }
      let user = await UserModel.findOne({ idCard: id, active: "true" });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      let teacher = await TeacherModel.findOne({
        user_id: user._id,
        active: "true",
      });
      if (!teacher) {
        return res.status(404).json({ msg: "Teacher not found" });
      }
      let array = teacher.schools_list;
      array.push(school._id);
      let upTeacher = await TeacherModel.updateOne(
        { user_id: user._id, active: "true" },
        { $set: { schools_list: array } }
      );
      res.json(upTeacher);
    } catch (err) {
      res.json({ "err from add school": err });
    }
  },

  editTeacher: async (req, res) => {
    let idEdit = req.params.id;
    let user = await UserModel.findOne({
      _id: req.tokenData._id,
      active: "true",
    });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    let userUp = await UserModel.findOne({ idCard: idEdit, active: "true" });
    if (!userUp) {
      return res.status(404).json({ msg: "User to update not found" });
    }
    // let validBody = userValidate(req.body);
    // if (validBody.error) {
    //   return res.status(400).json(validBody.error.details);
    // }
    try {
      let data;
      if (
        (req.tokenData.role == "admin" || idEdit == user.idCard) &&
        userUp.role == "teacher"
      ) {
        req.body.user.password = await bcrypt.hash(req.body.user.password, 10);
        data = await UserModel.updateOne(
          { idCard: idEdit, active: "true" },
          req.body.user
        );
        let teacher = await TeacherModel.updateOne(
          { user_id: userUp._id, active: "true" },
          req.body.other
        );
        data = {
          updateUser: data.modifiedCount,
          updateTeacher: teacher.modifiedCount,
        };
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
  },
};
