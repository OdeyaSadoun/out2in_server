const express = require("express");
const router = express.Router();
const { authRole, auth } = require("../middleware/auth");
const { messagesCtrl } = require("../controllers/messages.controllers");

router.get(
  "/:teacherId",
  auth,
  authRole(["admin", "teacher"]),
  messagesCtrl.getMessagesByUserId
);

router.post(
  "/:studentId",
  auth,
  authRole(["admin", "student","principal"]),
  messagesCtrl.sendMessageToTeacher
);


router.post(
  "/",
  auth,
  authRole(["admin", "student", "teacher", "principal"]),
  messagesCtrl.sendMessagesToAll
);

router.patch(
  "/deleteMessage/:messageId",
  auth,
  authRole(["admin", "teacher","principal"]),
  messagesCtrl.deleteMessage
);

router.patch(
  "/readMessage/:messageId",
  auth,
  authRole(["admin", "teacher","principal"]),
  messagesCtrl.readMessage
);
router.get(
    "/checkMessage/:messageId",
    auth,
    authRole(["admin", "teacher", "student","principal"]),
    messagesCtrl.checkMessage
  );
  router.get(
    "/getStudentListThatSendImportanteMessageByClassId/:classId",
    auth,
    authRole(["teacher", "admin","principal"]),
    messagesCtrl.getStudentListThatSendImportanteMessageByClassId
  );
  
router.patch(
    "/checkMessage/:messageId",
    auth,
    authRole(["admin", "teacher", "student"]),
    messagesCtrl.updateImportantInMessage
  );
router.patch(
    "/deleteStudentMessages/:studIdCard",
    auth,
    authRole(["admin", "teacher"]),
    messagesCtrl.deleteStudentMessages
  );
  

module.exports = router;
