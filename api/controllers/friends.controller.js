// const py = require("py");
const { default: axios } = require("axios");
const { FriendModel } = require("../models/friends.model");

exports.friendCtrl = {
  addNewQuestionnaireAnswer: async (req, res) => {
    try {

      const friends_list = req.body.friends;
      const student = req.tokenData._id;
      let newAnswer;

      console.log(friends_list);

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      if (friends_list.length > 0) {
        newAnswer = new FriendModel({
          "student": student,
          "friends": friends_list,
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
  getFriendsList: async (req, res) => {
    try {
      let data = await FriendModel.find({});
      res.json(data);
    } catch (error) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },
  calcSocialIndexStudentsByQuestionnaire: async (req, res) => {
    try {
      const  friends_list  = req.body;
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
