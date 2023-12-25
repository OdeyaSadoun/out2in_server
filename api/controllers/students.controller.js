const { userValidate } = require("../validations/users.validation");
const { StudentModel } = require("../models/students.model");
const { UserModel } = require("../models/users.model");

exports.studentCtrl = {
  getStudentInfo: async (req, res) => {
    try {
        let studentInfo = await StudentModel.findOne(
          { user_id: req.tokenData._id }
        );
        res.json({"user":req.userInfo,"student info":studentInfo});
      } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err });
      }   
  },
  getAllStudentsTeacher: async (req, res) => {
    //todo get all student that connected to the teacher
  },
  getAllStudents: async (req, res) => {
    try {
        let data = await StudentModel.find({});  
        res.json(data);
      } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err });
      }
      //todo add all the data to the students
  },
  getStudentById: async (req, res) => {},
  getSocialRankForStudent: async (req, res) => {},
  getTheLowesSocialRankStudents: async (req, res) => {},
  getAllSocialRankStudents: async (req, res) => {},
  getAttendance: async (req, res) => {},
  getAttendanceForStudent: async (req, res) => {},
  addNewQuestionnaireAnswer: async (req, res) => {},
  updateStudent: async (req, res) => {},
  deleteStudent: async (req, res) => {},
};
