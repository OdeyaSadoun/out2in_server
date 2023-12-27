const express = require("express");
const { auth, authRole } = require("../middleware/auth");
const { friendCtrl } = require("../controllers/friends.controller");

const router = express.Router();

router.post("/questionnaire", auth, authRole("student"), friendCtrl.addNewQuestionnaireAnswer);
router.get("/calc", auth, authRole("teacher"), friendCtrl.calc); //to do check that this teacher connect to this class

module.exports = router;