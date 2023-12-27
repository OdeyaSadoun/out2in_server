// const py = require("py");

const { FriendModel } = require("../models/friends.model");
const { exec } = require('child_process');

// Function to execute Python code
const runPythonCode = (code) => {
  return new Promise((resolve, reject) => {
    exec(`python -c "${code}"`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        reject(stderr);
        return;
      }
      resolve(stdout);
    });
  });
};

const runPythonScript = (scriptPath) => {
  return new Promise((resolve, reject) => {
    exec(`python ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        reject(stderr);
        return;
      }
      resolve(stdout);
    });
  });
};

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
  calc: async (req, res) => {
    try {
      // const pythonCode = "print('hello world')";
      let n = `api/algorithms/python_files/hello.py`
      const result = await runPythonScript(n);
      console.log("Python script executed successfully:", result);
  
      // Send the result back in the response if needed
      res.status(200).json({ result });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
