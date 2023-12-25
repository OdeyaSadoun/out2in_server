
const express = require("express");
const router = express.Router();
const { classesCtrl } = require("../controllers/classes.controller");


router.get("/classes/:id", auth, authRole(["admin","principal", "teacher"]), classesCtrl.getClassById);
router.get("/classes/students", auth, authRole(["admin","principal", "teacher","student"]), classesCtrl.getAllStudentsInClass);
router.get("/classes",auth, authRole(["admin","principal", "teacher"]), classesCtrl.getAllClasses);
router.get("/classes/places",auth, authRole(["admin","principal", "teacher"]), classesCtrl.getAllPlaces);

// router.get("/classes/distribution", classesCtrl.getClassAttendanceDistribution);
// router.get("/classes/distribution/:id", classesCtrl.getAttendanceDistributionForStudent);
// router.post("/classes/attendance", classesCtrl.fillClassAttendance);
router.post("/classes/places", auth, authRole(["admin","principal", "teacher"]),classesCtrl.addPlacesToClass);
router.post("/classes",auth, authRole(["admin","principal", "teacher"]), classesCtrl.addClass);

// router.put("/classes/attendance/:id", classesCtrl.updateAttendanceForStudent);
router.put("/classes/addTeacherClass",auth, authRole(["admin","principal", "teacher"]), classesCtrl.addClassToTeacher);
router.put("/classes/:id",auth, authRole(["admin","principal", "teacher"]), classesCtrl.updateClass);

router.delete("/classes/:id",auth, authRole(["admin","principal", "teacher"]), classesCtrl.deleteClass);

module.exports = router;
