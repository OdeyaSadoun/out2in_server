const { TeacherModel } = require("../models/teachers.model");
const { UserModel } = require("../models/users.model");
const { SchoolsModel } = require("../models/schools.model");
const bcrypt = require("bcrypt");
const { StudentModel } = require("../models/students.model");



exports.teacherlCtrl = {
  getTeacherInfo: async (req, res) => {
    try {
      let teacherInfo = await TeacherModel.findOne(
        { user_id: req.tokenData._id  }
      ).populate("schools_list");
      res.json({ "user": req.userInfo, "other": teacherInfo });
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
      let teacherByPrincipal = data.filter(teach => teach.schools_list.includes(school._id)&&teach.user_id.active==true)
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
  getAllTeachersByStudent: async (req, res) => {
    try {
      let student = await StudentModel.findOne(
        { user_id: req.tokenData._id }
      );
      let data = await TeacherModel.find({}).populate("user_id", { "password": 0 });
      let teachersByClass = data.filter(teacher => teacher.classes_list.includes(student.class_id))
        res.json(teachersByClass);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },
  getClasses:async(req,res)=>{

    let data =await TeacherModel.findOne({user_id:req.tokenData._id}).populate("classes_list")
    // let data2 =await TeacherModel.find({})
    res.json(data.classes_list)
  },
  addSchool:async(req,res)=>{
    let id=req.params.id
    let school = await SchoolsModel.findOne(
      { principal_id: req.tokenData._id }
    );
    try{
      let user=await UserModel.findOne({idCard: id})
      let teacher=await TeacherModel.findOne({user_id: user._id})
      let array=teacher.schools_list
      array.push(school._id)
      let upTeacher=await TeacherModel.updateOne({user_id: user._id},{ $set: { "schools_list": array} })
      res.json(upTeacher)
    }
    catch(err){
      res.json({"err from add school":err})
    }
    

  },
  editTeacher: async(req,res)=>{
    let idEdit = req.params.id;
    let user=await UserModel.findOne({_id: req.tokenData._id})
    let userUp=await UserModel.findOne({idCard: idEdit})
    // let validBody = userValidate(req.body);
    // if (validBody.error) {
    //   return res.status(400).json(validBody.error.details);
    // }
    try {
      let data;
      if ((req.tokenData.role == "admin"||idEdit == user.idCard)&&userUp.role=="teacher") {
        req.body.user.password = await bcrypt.hash(req.body.user.password, 10);
        data = await UserModel.updateOne({ idCard: idEdit }, req.body.user);
        let teacher= await TeacherModel.updateOne({user_id:userUp._id},req.body.other)
        data={"updateUser":data.modifiedCount,"updateTeacher":teacher.modifiedCount}
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

