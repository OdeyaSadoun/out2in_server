
const express = require("express");
const router = express.Router();
const { classCtrl } = require("../controllers/classes.controller");
const { auth, authRole } = require("../middleware/auth");


router.get("/classes/:id", auth, authRole(["admin","principal", "teacher"]), classCtrl.getClassById);
router.get("/classes/students", auth, authRole(["admin","principal", "teacher","student"]), classCtrl.getAllStudentsInClass);
router.get("/classes",auth, authRole(["admin","principal", "teacher"]), classCtrl.getAllClasses);
router.get("/classes/places",auth, authRole(["admin","principal", "teacher"]), classCtrl.getAllPlaces);

// router.get("/classes/distribution", classesCtrl.getClassAttendanceDistribution);
// router.get("/classes/distribution/:id", classesCtrl.getAttendanceDistributionForStudent);
// router.post("/classes/attendance", classesCtrl.fillClassAttendance);
router.post("/classes/places", auth, authRole(["admin","principal", "teacher"]),classCtrl.addPlacesToClass);
router.post("/classes",auth, authRole(["admin","principal", "teacher"]), classCtrl.addClass);

// router.put("/classes/attendance/:id", classesCtrl.updateAttendanceForStudent);
router.put("/classes/addTeacherClass",auth, authRole(["admin","principal", "teacher"]), classCtrl.addClassToTeacher);
router.put("/classes/:id",auth, authRole(["admin","principal", "teacher"]), classCtrl.updateClass);

router.delete("/classes/:id",auth, authRole(["admin","principal", "teacher"]), classCtrl.deleteClass);

module.exports = router;
