const express = require("express");
const { auth, authRole } = require("../middleware/auth");
const { friendCtrl } = require("../controllers/friends.controller");

const router = express.Router();

router.post("/questionnaire", auth, authRole("student"), friendCtrl.addNewQuestionnaireAnswer);

module.exports = router;