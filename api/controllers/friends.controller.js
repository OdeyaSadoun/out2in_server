const { FriendModel } = require("../models/friends.model");

exports.friendCtrl = {
  addNewQuestionnaireAnswer: async (req, res) => {
    try {
      const friends_list = req.body.friends_list;
      const student_id = req.body.student_id;
      let newAnswer;

      if (!student_id) {
        return res.status(404).json({ error: "Student not found" });
      }
      if (friends_list.length > 0) {
        newAnswer = new FriendModel({
          user_id: student_id,
          friends_list,
        });
      }
      await newAnswer.save();
      res.status(201).json(newAnswer);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
