const { MessageModel } = require("../models/messages.model");
const { messageValidate } = require("../validations/messages.validation");

exports.messagesCtrl = {
    getMessagesByUserId: async (req, res) => {
        try {
            const userId = req.params.userId;
            let data = await SchoolsModel.find({ userId: userId });
            res.json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Error", error: err.message });
        }
    },
    sendMessageToTeacher: async (req, res) => {
        try {
            const studentId = req.params.studentId;

            const { teacherId, title, value } = req.body;

            const newMessage = new MessageModel({
                student_id: studentId,
                teacher_id: teacherId,
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
    }
}