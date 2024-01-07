const express = require("express");
const { auth, authRole } = require("../middleware/auth");
const { getUserInfo } = require("../middleware/user");
const { teacherlCtrl } = require("../controllers/teachers.controller");
const router = express.Router();

router.get(
  "/myInfo",
  auth,
  authRole("teacher"),
  getUserInfo,
  teacherlCtrl.getTeacherInfo
);

router.post(
  "/getTeacherByIdCard",
  auth,
  authRole(["teacher", "principal", "admin"]),
  teacherlCtrl.getTeacherById
);

router.get(
  "/getAllTeachers",
  auth,
  authRole("principal"),
  teacherlCtrl.getAllTeachers
);

router.get(
  "/getAllTeachersByStudent",
  auth,
  authRole("student"),
  teacherlCtrl.getAllTeachersByStudent
);

router.patch(
  "/addSchool/:id",
  auth,
  authRole("principal"),
  teacherlCtrl.addSchool
);

router.put("/edit/:id", auth, teacherlCtrl.editTeacher);

module.exports = router;
