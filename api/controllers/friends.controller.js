// const py = require("py");
const { default: axios } = require("axios");
const { FriendModel } = require("../models/friends.model");
const { StudentModel } = require("../models/students.model");
const { UserModel } = require("../models/users.model");
const { ObjectId } = require('mongoose');


exports.friendCtrl = {
  getFriendsList: async (req, res) => {
    try {
        let { classId } = req.params;

        let student = await StudentModel.find({
            class_id: classId,
        }).populate("user_id", {password: 0});
        if (!student) {
            return res.status(404).json({ msg: "Student not found" });
        }
        console.log(1);

        let filterStudents = student.filter((student) => student.user_id.active);
        console.log(2);

        // Use `pluck()` to get the student IDs
        let friendsJsonID = filterStudents.map(student => student.user_id._id );
        console.log(3, friendsJsonID);

        let friendsByClass = await FriendModel.find({ active: "true" });
        console.log(4, friendsByClass);
        let filterdata = friendsByClass.filter((friend) => 
        // friend.student
        friendsJsonID.includes((friend.student)));
        console.log(5, filterdata);

        res.json(friendsByClass);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err });
    }
},


  // getFriendsList: async (req, res) => {
  //   try {
  //     let { classId } = req.params;

  //     let student = await StudentModel.find({
  //       class_id: classId,
  //     }).populate("user_id", {password: 0});
  //     if (!student) {
  //       return res.status(404).json({ msg: "Student not found" });
  //     }
  //     let filterStudents = student.filter(item => item.user_id.active);

  //     let friendsJsonID = filterStudents.map((f) => String(f.user_id));
  //     console.log(friendsJsonID);
  //     let data = await FriendModel.find({ active: "true" });
  //     if (!data) {
  //       return res.status(404).json({ msg: "Friends not found" });
  //     }
  //     if(friendsJsonID.includes("65a6898636efcaf9b0bc78f9")){
  //       console.log("65a6898636efcaf9b0bc78f9- work includes");
  //     }
  //     else{
  //       console.log("not work");
  //     }
  //     console.log("data", data);
  //     let friendsByClass = data.filter((fr) => {
  //       let studentIdString = String(fr.student);
  //       console.log(studentIdString);
  //       return friendsJsonID.includes(studentIdString);
  //   });
  //     console.log(friendsByClass);
  //     res.json(friendsByClass);
  //   } catch (error) {
  //     console.log(err);
  //     res.status(500).json({ msg: "err", err });
  //   }
  // },
  // getFriendsList: async (req, res) => {
  //   try {
  //     const { classId } = req.params;

  //     // שאילתת MongoDB המביאה את כל התלמידים הפעילים בכיתה
  //     const activeStudents = await StudentModel.find({
  //       class_id: classId,
  //       "user_id.active": true,
  //     });

  //     // מביאים את רשימת החברים הפעילים
  //     const friendsList = await FriendModel.find({
  //       active: true,
  //       student: { $in: activeStudents.map((student) => student.user_id) },
  //     });
  //     console.log("friendsList", friendsList);
  //     res.json(friendsList);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ msg: "Internal Server Error", error });
  //   }
  // },

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
      const {
        friends_list,
        grades_record,
        attendance_record,
        important_messages_record,
      } = req.body;
      try {
        const response = await axios.post(
          "https://out2in-python-server.onrender.com/calculate_social_index",
          {
            friends_list,
            grades_record,
            attendance_record,
            important_messages_record,
          },
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

  updateFriends: async (req, res) => {
    try {
      const friendsList = req.body.friends;
      const student = req.tokenData._id;

      let stu = await FriendModel.updateOne(
        { student: student, active: "true" },
        { $set: { friends_list: friendsList } }
      );

      res.status(201).json(stu);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  checkStudent: async (req, res) => {
    const student = req.tokenData._id;
    let user = await FriendModel.findOne({ student: student });
    if (!user) {
      res.json(false);
    } else {
      res.json(true);
    }
  },

  deleteStudentAndSurveys: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await UserModel.findOne({ idCard: id, active: true });

      if (!user) {
        return res.status(404).json({ msg: "user not found" });
      }

      const student = await StudentModel.findOne({
        user_id: user._id,
      }).populate("user_id", { password: 0 });

      if (!student) {
        return res.status(404).json({ msg: "student not found" });
      }

      console.log("friendssss student", student);
      await FriendModel.updateOne(
        { student: student._id, active: true },
        { $set: { active: false } }
      );

      await FriendModel.updateMany(
        { "students_list.student_id": student._id },
        { $set: { "students_list.$.student_id": null } }
      );

      console.log("friendssss student finish");

      res.json({
        success: true,
        message: "Student and surveys deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting student and surveys:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
