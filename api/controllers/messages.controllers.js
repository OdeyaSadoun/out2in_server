const { MessageModel } = require("../models/messages.model");
const { UserModel } = require("../models/users.model");
const { messageValidate } = require("../validations/messages.validation");

const checkMessageIfHasBullyingWords = async (msg) => {
  console.log("message server", msg);
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
      const teacherId = req.params.teacherId;
      let messages = await MessageModel.find({
        teacher_id: teacherId,
      }).populate("student_id");
      let messagesActive = messages.filter((m) => m.active == true);

      res.json(messagesActive);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Error", error: err.message });
    }
  },

  sendMessageToTeacher: async (req, res) => {
    try {
      const studentId = req.params.studentId;

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
      const allStudents = await StudentModel.find({}, "_id");
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
      const message = await MessageModel.findById(messageId);
      if (!message) {
        return res.status(404).json({ msg: "Message not found" });
      }

      const authenticatedUserId = req.tokenData._id;
      if (
        message.student_id.toString() !== authenticatedUserId &&
        message.teacher_id.toString() !== authenticatedUserId
      ) {
        return res
          .status(403)
          .json({ msg: "You do not have permission to delete this message" });
      }

      let data = await MessageModel.updateOne(
        { _id: messageId },
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

      const message = await MessageModel.findById(messageId);
      if (!message) {
        return res.status(404).json({ msg: "Message not found" });
      }

      let data = await MessageModel.updateOne(
        { _id: messageId },
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
      console.log(messageId);
      const message = await MessageModel.findOne({ _id: messageId });
      console.log(message);
      if (!message) {
        return res.status(404).json({ msg: "Message not found" });
      }

      let important = await checkMessageIfHasBullyingWords(message);
      console.log(important, "important");

      //   if (important) {
      //     message.important = true;
      //   }

      //   await message.save();

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

      const message = await MessageModel.findById(messageId);
      if (!message) {
        return res.status(404).json({ msg: "Message not found" });
      }

      if (important) {
        message.important = true;
      }
      let data = await MessageModel.updateOne(
        { _id: messageId },
        { $set: { important: important } }
      );

      console.log(message);

      res.json(message);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Error", error: err.message });
    }
  },
};
