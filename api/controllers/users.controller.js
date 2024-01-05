const { userValidate } = require("../validations/users.validation");
const { UserModel } = require("../models/users.model");
const { SchoolsModel } = require("../models/schools.model");
const { TeacherModel } = require("../models/teachers.model");
const { ClassModel } = require("../models/classes.model");
const { StudentModel } = require("../models/students.model");

exports.userlCtrl = {
  getAllUsers: async (req, res) => {
    try {
      let data = await UserModel.find({}, { password: 0 });
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },
  getUserById: async (req, res) => {
    
    try {
      let id=req.params.id
      let data = await UserModel.findOne({_id:id}, { password: 0 });
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },
getCurrentUser: async (req, res) => {
  let data = await UserModel.findOne({_id:req.tokenData._id}, { password: 0 });
  res.json(data);
},
  editUser: async (req, res) => {
    let idEdit = req.params.idEdit;
    let validBody = userValidate(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {

      let data;
      if (req.tokenData.role == "admin" || idEdit == req.tokenData._id) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        data = await UserModel.updateOne({ _id: idEdit }, req.body);
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

  deleteUser: async (req, res) => {

    let idDelete = req.body.idCard;
    try {
      let data;
      let user = await UserModel.findOne({ _id: req.tokenData._id });
      let userUp = await UserModel.findOne({ idCard: idDelete });
      
      if (req.tokenData.role == "admin" || (idDelete == user.idCard&&req.tokenData.role == "principal")) {
        data = await UserModel.updateOne({ _id: userUp._id }, { $set: { "active": false } });
      }
      else if (req.tokenData.role == "principal") {
        let school = await SchoolsModel.findOne(
          { principal_id: req.tokenData._id }
        );
        let data2 = await TeacherModel.find({});
        let teacherByPrincipal = data2.filter(teach => teach.schools_list.includes(school._id))
        let teacherByPrincipal1 = teacherByPrincipal.filter(teach => {
          let uid = String(userUp._id)
          let uid2 = String(teach.user_id)
          return uid == uid2
        })
        if (teacherByPrincipal1.length > 0) {
          data = await UserModel.updateOne({ _id: teacherByPrincipal1[0].user_id }, { $set: { "active": false } });
        }
        else {
          data = [
            {
              status: "failed",
              msg: "The teacher you are trying to delete is not registered in your school!",
            },
          ];
        }
      }
      else if (req.tokenData.role == "teacher") {
        try {
          let teacher = await TeacherModel.findOne({ user_id: req.tokenData._id })
          let classes = await ClassModel.find({});
          let classesByTeacher = classes.filter(item => teacher.classes_list.includes(item._id))
          let classesId = classesByTeacher.map(item => String(item._id))
          let data2 = await StudentModel.find({});
          let studentByTeacher = data2.filter(stu => {
            stuClass = String(stu.class_id)
            return classesId.includes(stuClass)
          })
          let studentByTeacher1 = studentByTeacher.filter(stu => {
            let uid = String(userUp._id)
            let uid2 = String(stu.user_id)
            return uid == uid2
          })
          data = await UserModel.updateOne({ _id: studentByTeacher1[0].user_id }, { $set: { "active": false } });
        }
        catch (err) {
          res.json( "The student is not in your class or you have no classes" )
        }
      }
      else {
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
