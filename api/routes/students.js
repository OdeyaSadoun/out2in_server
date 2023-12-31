const express = require("express");
const { auth, authRole } = require("../middleware/auth");
const { studentCtrl } = require("../controllers/students.controller");
const { getUserInfo } = require("../middleware/user");

const router = express.Router();

router.get("/myInfo", auth, authRole("student"), getUserInfo, studentCtrl.getStudentInfo);

router.get("/studentsByTeacher", auth, authRole("teacher"), studentCtrl.getAllStudentsTeacher);

router.get("/allStudents", auth, authRole(["admin", "principal"]), studentCtrl.getAllStudents);

router.get("/:id", auth, authRole(["admin", "principal", "teacher"]), studentCtrl.getStudentById);

router.get("/socialRank/:id", auth, authRole("teacher"), studentCtrl.getSocialRankForStudent);

router.get("/studentsInLowSocialRank", auth, authRole("teacher"), studentCtrl.getTheLowesSocialRankStudents);

router.get("/studentsSocialRank", auth, authRole("teacher"), studentCtrl.getAllSocialRankStudents);

router.get("/attendance", auth, authRole("teacher"), studentCtrl.getAttendance);

router.get("/attendance/:id", auth, authRole("teacher"), studentCtrl.getAttendanceForStudent);

// router.post("/questionnaire", auth, authRole("student"), studentCtrl.addNewQuestionnaireAnswer);

router.put("/:id", auth, authRole(["teacher", "student"]), studentCtrl.updateStudent);

// router.patch("/:id", auth, authRole(["admin", "principal", "teacher"]), studentCtrl.deleteStudent);

module.exports = router;


