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

const callPythonFunction = (functionName, args) => {
  return new Promise((resolve, reject) => {
    const formattedArgs = args.join(', '); // Convert array of arguments to a comma-separated string
    const command = `python -c "import sys; sys.path.append('path_to_python_file'); from python_module import ${functionName}; print(${functionName}(${formattedArgs}));"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        reject(stderr);
        return;
      }
      resolve(stdout.trim());
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
      const functionName = 'your_python_function'; // Replace this with your Python function name
      const args = ['arg1', 'arg2', 'arg3']; // Replace with multiple arguments for the Python function
      const result = await callPythonFunction(functionName, args);
      console.log("Result from Python function:", result);
  
      // Send the result back in the response if needed
      res.status(200).json({ result });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
