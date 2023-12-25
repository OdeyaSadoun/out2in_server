const express = require("express");
const { auth, authRole } = require("../middleware/auth");
const { getUserInfo } = require("../middleware/user");
const { teacherlCtrl } = require("../controllers/teachers.controller");
const router = express.Router();



router.get("/myInfo",auth, authRole('teacher'),getUserInfo, teacherlCtrl.getTeacherInfo);
module.exports = router;
