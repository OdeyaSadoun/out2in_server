// const py = require("py");
const { default: axios } = require("axios");
const { FriendModel } = require("../models/friends.model");
const { StudentModel } = require("../models/students.model");

exports.friendCtrl = {
  getFriendsList: async (req, res) => {
    try {
      let { classId } = req.params;

      let student = await StudentModel.find({
        class_id: classId,
        active: "true",
      });
      if (!student) {
        return res.status(404).json({ msg: "Student not found" });
      }

      let friendsJsonID = student.map((f) => String(f.user_id));

      let data = await FriendModel.find({ active: "true" });
      if (!data) {
        return res.status(404).json({ msg: "Friends not found" });
      }
      let friendsByClass = data.filter((fr) => {
        return friendsJsonID.includes(String(fr.student));
      });
      res.json(friendsByClass);
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

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      if (friendsList.length > 0) {
        newAnswer = new FriendModel({
          student: student,
          friends_list: friendsList,
        });
      }

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
