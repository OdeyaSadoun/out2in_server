const express = require("express");
const { auth, authRole } = require("../middleware/auth");
const { studentCtrl } = require("../controllers/students.controller");
const { getUserInfo } = require("../middleware/user");

const router = express.Router();

router.get("/students/info", auth, authRole("student"), getUserInfo, studentCtrl.getStudentInfo);

router.get("students/studentsByTeacher", auth, authRole("teacher"), studentCtrl.getAllStudentsTeacher);

router.get("/allStudents", auth, authRole(["admin", "principal"]), studentCtrl.getAllStudents);

router.get("/students/:id", auth, authRole(["admin", "principal", "teacher"]), studentCtrl.getStudentById);

router.get("/students/socialRank/:id", auth, authRole("teacher"), studentCtrl.getSocialRankForStudent);

router.get("/students/studentsInLowSocialRank", auth, authRole("teacher"), studentCtrl.getTheLowesSocialRankStudents);

router.get("/students/studentsSocialRank", auth, authRole("teacher"), studentCtrl.getAllSocialRankStudents);

router.get("/students/attendance", auth, authRole("teacher"), studentCtrl.getAttendance);

router.get("/students/attendance/:id", auth, authRole("teacher"), studentCtrl.getAttendanceForStudent);

router.post("/students/questionnaire", auth, authRole("student"), studentCtrl.addNewQuestionnaireAnswer);

router.put("/students/:id", auth, authRole(["teacher", "student"]), studentCtrl.updateStudent);

router.patch("/students/:id", auth, authRole(["admin", "principal", "teacher"]), studentCtrl.deleteStudent);

module.exports = router;


