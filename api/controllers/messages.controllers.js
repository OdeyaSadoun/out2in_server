const { MessageModel } = require("../models/messages.model");
const { UserModel } = require("../models/users.model");
const { messageValidate } = require("../validations/messages.validation");

exports.messagesCtrl = {
    getMessagesByUserId: async (req, res) => {
        try {
            const teacherId = req.params.teacherId;
            let data = await MessageModel.find({ teacher_id: teacherId }).populate("student_id")
            res.json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Error", error: err.message });
        }
    },

    sendMessageToTeacher: async (req, res) => {
        try {
            const studentId = req.params.studentId;

            const { teacher_id, title, value } = req.body;

            const newMessage = new MessageModel({
                student_id: studentId,
                teacher_id: teacher_id,
                title: title,
                value: value,
                read: false,
                active: true,
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
            const messageId = req.params.messageId;
            const message = await MessageModel.findById(messageId);

            if (!message) {
                return res.status(404).json({ msg: "Message not found" });
            }

            const authenticatedUserId = req.user.id;
            if (message.student_id.toString() !== authenticatedUserId && message.teacher_id.toString() !== authenticatedUserId) {
                return res.status(403).json({ msg: "You do not have permission to delete this message" });
            }

            message.active = false;

            await message.save();

            res.json({ msg: "Message marked as inactive successfully" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: "Error", error: err.message });
        }
    },

    readMessage: async (req, res) => {
        try {
            const messageId = req.params.messageId;
            const message = await MessageModel.findById(messageId);

            if (!message) {
                return res.status(404).json({ msg: "Message not found" });
            }

            message.read = true;

            await message.save();

            res.json({ msg: "The message has been marked as successfully read" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: "Error", error: err.message });
        }
    }
}