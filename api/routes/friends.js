const express = require("express");
const { auth, authRole } = require("../middleware/auth");
const { friendCtrl } = require("../controllers/friends.controller");

const router = express.Router();

router.post(
  "/questionnaire",
  auth,
  authRole("student"),
  friendCtrl.addNewQuestionnaireAnswer
);
router.get("/checkStudent", auth, friendCtrl.checkStudent);
router.get("/:classId", auth, authRole("teacher,principal"), friendCtrl.getFriendsList); //to do check that this teacher connect to this class
router.post("/calcSocialIndexStudentsByQuestionnaire",auth,authRole("teacher,principal"),friendCtrl.calcSocialIndexStudentsByQuestionnaire); //to do check that this teacher connect to this class
router.patch("/updateFriends", auth, friendCtrl.updateFriends);
router.patch(
  "/deleteStudentAndSurveys/:id",
  friendCtrl.deleteStudentAndSurveys
);

module.exports = router;
