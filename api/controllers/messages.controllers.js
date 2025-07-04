const { default: mongoose } = require("mongoose");
const { ClassModel } = require("../models/classes.model");
const { MessageModel } = require("../models/messages.model");
const { StudentModel } = require("../models/students.model");
const { UserModel } = require("../models/users.model");
const { messageValidate } = require("../validations/messages.validation");

const checkMessageIfHasBullyingWords = async (msg) => {
  const bullyingWords = new Set([
    "חרם",
    "מחרימים אותי",
    "בריונות",
    "התעללות",
    "הטרדה",
    "השפלה",
    "איומים",
    "לא רוצה להגיע לבית ספר",
    "מפחדת להגיע לבית ספר",
    "מפחד להגיע לבית ספר",
    "משתדל לא להגיע לבית ספר",
    "בושה ללכת לבית ספר",
    "לא רוצה להתקרב לאנשים",
    "בודד",
    "עצוב",
    "בודדה",
    "עצובה",
    "מתוסכל",
    "מתוסכלת",
    "מפחד",
    "מפחדת",
    "מכות",
    "מרביצים לי",
    "נפגעתי",
    "פגעו בי",
    "לא מרגיש בטוח",
    "לא מרגיש שייך",
    "לא מרגיש מוערך",
    "לא מרגיש אהוב",
    "לא מרגישה בטוחה",
    "לא מרגישה שייכת",
    "לא מרגישה מוערכת",
    "לא מרגישה אהובה",
    "לא משחקים איתי",
    "בדידות בכיתה",
    "הרגשת ניכור",
    "חרם חברתי",
    "לא מתקבלים",
    "מרגיש מנודה",
    "התעללות רגשית",
    "צוחקים עלי",
  ]);

  const text = msg.toString();
  for (const word of bullyingWords) {
    if (text.includes(word)) {
      return true;
    }
  }

  return false;
};

exports.messagesCtrl = {
  getMessagesByUserId: async (req, res) => {
    try {
      const { teacherId } = req.params;
      let messages = await MessageModel.find({
        teacher_id: teacherId,
        active: "true",
      }).populate("student_id");
      if (!messages) {
        return res.status(404).json({ msg: "Messages not found" });
      }
      // let messagesActive = messages.filter((m) => m.active == true);
      res.json(messages);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Error", error: err.message });
    }
  },

  sendMessageToTeacher: async (req, res) => {
    try {
      const { studentId } = req.params;

      const { teacher_id, title, value } = req.body;

      let important = await checkMessageIfHasBullyingWords(value);

      const newMessage = new MessageModel({
        student_id: studentId,
        teacher_id,
        title,
        value,
        important,
      });

      await newMessage.save();

      res.json({ msg: "Message sent successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Error", error: err.message });
    }
  },

  sendMessagesToAll: async (req, res) => {
    try {
      const { teacherId, title, value } = req.body;
      const allStudents = await StudentModel.find({ active: "true" }, "_id");
      if (!allStudents) {
        return res.status(404).json({ msg: "Students not found" });
      }
      for (const student of allStudents) {
        const newMessage = new MessageModel({
          student_id: student._id,
          teacher_id: teacherId,
          title: title,
          value: value,
          read: false,
          active: true,
        });

        await newMessage.save();
      }

      res.json({ msg: "Message sent to all students successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Error", error: err.message });
    }
  },

  deleteMessage: async (req, res) => {
    try {
      const { messageId } = req.params;
      const message = await MessageModel.findOne({
        _id: messageId,
        active: "true",
      });
      if (!message) {
        return res.status(404).json({ msg: "Message not found" });
      }

      const authenticatedUserId = req.tokenData._id;
      if (message.teacher_id.toString() !== authenticatedUserId) {
        return res
          .status(403)
          .json({ msg: "You do not have permission to delete this message" });
      }

      let data = await MessageModel.updateOne(
        { _id: messageId, active: "true" },
        { $set: { active: false } }
      );

      res.json(message);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Error", error: err.message });
    }
  },

  readMessage: async (req, res) => {
    try {
      const { messageId } = req.params;
      const { read } = req.body;

      const message = await MessageModel.findOne({
        _id: messageId,
        active: "true",
      });
      if (!message) {
        return res.status(404).json({ msg: "Message not found" });
      }

      let data = await MessageModel.updateOne(
        { _id: messageId, active: "true" },
        { $set: { read: read } }
      );

      res.json(message);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Error", error: err.message });
    }
  },

  checkMessage: async (req, res) => {
    try {
      const { messageId } = req.params;
      const message = await MessageModel.findOne({
        _id: messageId,
        active: "true",
      });
      if (!message) {
        return res.status(404).json({ msg: "Message not found" });
      }

      let important = await checkMessageIfHasBullyingWords(message);

      res.json({ important: important });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Error", error: err.message });
    }
  },

  updateImportantInMessage: async (req, res) => {
    try {
      const { messageId } = req.params;
      const { important } = req.body;

      const message = await MessageModel.findOne({
        _id: messageId,
        active: "true",
      });
      if (!message) {
        return res.status(404).json({ msg: "Message not found" });
      }

      if (important) {
        message.important = true;
      }
      let data = await MessageModel.updateOne(
        { _id: messageId, active: "true" },
        { $set: { important: important } }
      );
      res.json(message);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Error", error: err.message });
    }
  },

  getStudentListThatSendImportanteMessageByClassId: async (req, res) => {
    const { classId } = req.params;
    try {
      let cls = await ClassModel.findOne({ _id: classId, active: true });

      if (!cls) {
        return res.status(404).json("Class not found");
      }

      let studentsClass = await StudentModel.find({
        class_id: classId,
        active: true,
      });
      if (!studentsClass || studentsClass.length === 0) {
        return res.status(404).json("Students in this class not found");
      }
      let filterStudents = studentsClass.filter(item => item.user_id.active);


      const studentIds = filterStudents.map((student) => student._id.toString());

      // Find important messages sent in the last month
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      // Find messages sent by students in the last month
      const importantMessages = await MessageModel.find({
        student_id: {
          $in: studentIds.map((id) => mongoose.Types.ObjectId(id)),
        },
        important: true,
        date_created: { $gte: lastMonth },
        active: true,
      });

      const studentsWithImportantMessages = filterStudents.map((student) => {
        // Check if the student sent an important message in the last month
        const hasImportantMessage = importantMessages.some((message) =>
          message.student_id.equals(student._id)
        );
        return {
          student: student.user_id,
          hasImportantMessage: hasImportantMessage,
        };
      });

      res.status(200).json({ studentsWithImportantMessages });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Error", error: err.message });
    }
  },

  deleteStudentMessages: async (req, res) => {
    const { studIdCard } = req.params;
    console.log("deleteStudentMessages");

    try {
      const user = await UserModel.findOne({
        idCard: studIdCard,
        active: true,
      });

      if (!user) {
        return res.status(404).json({ msg: "user not found" });
      }

      console.log("user", user);

      const student = await StudentModel.findOne({
        user_id: user._id,
      }).populate("user_id", { password: 0 });

      if (!student) {
        return res.status(404).json({ msg: "student not found" });
      }

      console.log("student", student);
      // מחק את כל ההודעות הקשורות לתלמיד
      await MessageModel.updateMany(
        { student: student._id, active: true },
        { $set: { active: false } }
      );
      console.log("999999");
      res.json({
        success: true,
        message: "Student messages deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting student messages:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
