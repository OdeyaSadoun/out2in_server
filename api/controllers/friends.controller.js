// const py = require("py");

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
      // .populate("user_id", {
      //   password: 0,
      // });
      console.log(data);
      res.json(data);
      // // const pythonCode = "print('hello world')";
      // const functionName = 'your_python_function'; // Replace this with your Python function name
      // const args = ['arg1', 'arg2', 'arg3']; // Replace with multiple arguments for the Python function
      // const result = await callPythonFunction(functionName, args);
      // console.log("Result from Python function:", result);

      // // Send the result back in the response if needed
      // res.status(200).json({ result });
    } catch (error) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },
};
