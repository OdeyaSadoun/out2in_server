
const express = require("express");
const router = express.Router();
const { classCtrl } = require("../controllers/classes.controller");
const { auth, authRole } = require("../middleware/auth");

router.get("/",classCtrl.getAllClasses);

router.get("/getClassesByTeacherId",auth, authRole('teacher'), classCtrl.getClassesByTeacherId);

router.get("/getClassBySchoolId/:id", auth, authRole(["admin","principal", "teacher"]), classCtrl.getClassesBySchoolId);

router.get("/places",auth, authRole(["admin","principal", "teacher"]), classCtrl.getAllPlaces);

router.get("/:id", auth, authRole(["admin","principal", "teacher"]), classCtrl.getClassById);

router.post("/getAttendanceByClassAndDate",auth, authRole('teacher'), classCtrl.getAttendanceByClassAndDate);

router.post("/places", auth, authRole(["admin","principal", "teacher"]),classCtrl.addPlacesToClass);

router.post("/getMap", auth, authRole(["admin","principal", "teacher"]),classCtrl.getMapsByDateAndClass);

router.post("/",auth, authRole(["admin","principal", "teacher"]), classCtrl.addClass);

router.post("/addAttendance/:classId",auth, authRole(["admin","principal", "teacher"]), classCtrl.AddAttendance);

router.put("/addTeacherClass/:classId",auth, authRole(["admin","principal", "teacher"]), classCtrl.addClassToTeacher);

router.put("/updateAttendance",auth, authRole(["admin","principal", "teacher"]), classCtrl.updateAttendance);

router.put("/:id",auth, authRole(["admin","principal", "teacher"]), classCtrl.updateClass);

router.put("/delete/:id",auth, authRole(["admin","principal", "teacher"]), classCtrl.deleteClass);

router.patch("/deleteStudentAndAttendance/:studIdCard",auth, authRole(["admin","principal", "teacher"]), classCtrl.deleteStudentAndAttendance);

module.exports = router;
