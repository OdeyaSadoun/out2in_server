// const py = require("py");
const { default: axios } = require("axios");
const { FriendModel } = require("../models/friends.model");
const { TeacherModel } = require("../models/teachers.model");
const { StudentModel } = require("../models/students.model");

exports.friendCtrl = {
  getFriendsList: async (req, res) => {
    try {
      let student = await StudentModel.find({});
      let teacher = await TeacherModel.findOne({ user_id: req.tokenData._id });
      let friendsJson = student.filter((stud) => {
        return teacher.classes_list.includes(stud.class_id);
      });
      let friendsJsonID = friendsJson.map((f) => String(f.user_id));
      let data = await FriendModel.find({});
      let friendsByTeacher = data.filter((fr) => {
        return friendsJsonID.includes(String(fr.student));
      });
      res.json(friendsByTeacher);
    } catch (error) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  addNewQuestionnaireAnswer: async (req, res) => {
    try {
      const friendsList = req.body.friends;
      const student = req.tokenData._id;
      let newAnswer;

      console.log(friendsList);

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      if (friendsList.length > 0) {
        newAnswer = new FriendModel({
          student: student,
          friends_list: friendsList,
        });
      }

      console.log(newAnswer);
      await newAnswer.save();
      res.status(201).json(newAnswer);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  calcSocialIndexStudentsByQuestionnaire: async (req, res) => {
    try {
      const friends_list = req.body;
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/calculate_social_index",
          { friends_list: friends_list },
          {
            headers: {
              "Content-type": "application/json",
            },
          }
        );

        console.log(response.data);
        res.status(200).json(response.data);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },
};
