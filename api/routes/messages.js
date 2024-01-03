
const express = require("express");
const router = express.Router();
const { authRole, auth } = require("../middleware/auth");
const { messagesCtrl } = require("../controllers/messages.controllers");

router.get("/:teacherId",auth,authRole(["admin","teacher"]),messagesCtrl.getMessagesByUserId);

router.post("/:studentId",auth,authRole(["admin","student"]),messagesCtrl.sendMessageToTeacher);

router.post("/",auth,authRole(["admin","student","teacher","principal"]),messagesCtrl.sendMessagesToAll);

router.patch("/deactiveMessage/:messageId",auth,authRole(["admin","teacher"]),messagesCtrl.deleteMessage);

router.patch("/readMessage/:messageId",auth,authRole(["admin","teacher"]),messagesCtrl.readMessage);


module.exports = router;
