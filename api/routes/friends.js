const express = require("express");
const { auth, authRole } = require("../middleware/auth");
const { friendCtrl } = require("../controllers/friends.controller");

const router = express.Router();

router.post("/questionnaire", auth, authRole("student"), friendCtrl.addNewQuestionnaireAnswer);
router.get("/", auth, authRole("teacher"), friendCtrl.getFriendsList); //to do check that this teacher connect to this class
router.post("/calcSocialIndexStudentsByQuestionnaire", auth, authRole("teacher"), friendCtrl.calcSocialIndexStudentsByQuestionnaire); //to do check that this teacher connect to this class

module.exports = router;