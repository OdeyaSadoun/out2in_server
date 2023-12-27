// const py = require("py");

const { callPythonFunction } = require("../helpers/python.helper");
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
  getFriendsList: async (req, res) => {
    try {
      let data = await FriendModel.find({})
      res.json(data);

    } catch (error) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },
  calcSocialIndexStudents: async (req, res) => {
    try {
      const { friends_list } = req.body;
      const pyFunction = 'calc_social_index_students'; // Name of the Python function in social_index.py
      const args = friends_list;
      let url = "../api/algorithms/python_files/graph_funcs"
      let file = "graph_funcs"
      const result = await callPythonFunction(url,file,pyFunction, args);
      console.log("Result from Python function:", result);
  
      res.status(200).json({ result }); // Sending the result back in the response
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
