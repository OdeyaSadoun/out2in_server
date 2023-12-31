
const express = require("express");
const router = express.Router();
const { classCtrl } = require("../controllers/classes.controller");
const { auth, authRole } = require("../middleware/auth");


router.get("/:id", auth, authRole(["admin","principal", "teacher"]), classCtrl.getClassById);
router.get("/students", auth, authRole(["admin","principal", "teacher","student"]), classCtrl.getAllStudentsInClass);
router.get("/",classCtrl.getAllClasses);
router.get("/places",auth, authRole(["admin","principal", "teacher"]), classCtrl.getAllPlaces);

// router.get("/classes/distribution", classesCtrl.getClassAttendanceDistribution);
// router.get("/classes/distribution/:id", classesCtrl.getAttendanceDistributionForStudent);
// router.post("/classes/attendance", classesCtrl.fillClassAttendance);
router.post("/places", auth, authRole(["admin","principal", "teacher"]),classCtrl.addPlacesToClass);
router.post("/",auth, authRole(["admin","principal", "teacher"]), classCtrl.addClass);

// router.put("/classes/attendance/:id", classesCtrl.updateAttendanceForStudent);
router.put("/addTeacherClass/:id",auth, authRole(["admin","principal", "teacher"]), classCtrl.addClassToTeacher);
router.put("/:id",auth, authRole(["admin","principal", "teacher"]), classCtrl.updateClass);

router.delete("/:id",auth, authRole(["admin","principal", "teacher"]), classCtrl.deleteClass);

module.exports = router;
