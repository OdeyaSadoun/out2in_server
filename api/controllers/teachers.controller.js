const { TeacherModel } = require("../models/teachers.model");
const { userlCtrl } = require("../controllers/users.controller");
const { UserModel } = require("../models/users.model");


exports.teacherlCtrl = {
    getTeacherInfo:async(req, res)=>{
        
        // res.json(req.userInfo)
        try {
            let teacherInfo = await TeacherModel.findOne(
              { user_id: req.tokenData._id }
            );
            res.json({"user":req.userInfo,"teacher info":teacherInfo});
          } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "err", err });
          }
       
   
    }
  };
  
