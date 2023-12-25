
const express = require("express");
const router = express.Router();
const { classesCtrl } = require("../controllers/classes.controller");


router.get("/classes/:id", classesCtrl.getClassById);
router.get("/classes/students", classesCtrl.getAllStudentsInClass);
router.get("/classes", classesCtrl.getAllClasses);
router.get("/classes/places", classesCtrl.getAllPlaces);
router.get("/classes/distribution", classesCtrl.getClassAttendanceDistribution);
router.get("/classes/distribution/:id", classesCtrl.getAttendanceDistributionForStudent);
router.post("/classes/attendance", classesCtrl.fillClassAttendance);
router.post("/classes/places", classesCtrl.addPlacesToClass);
router.post("/classes", classesCtrl.addClass);

router.put("/classes/attendance/:id", classesCtrl.updateAttendanceForStudent);

// Add a class to a teacher
router.put("/classes/addTeacherClass", classesCtrl.addClassToTeacher);

// Update class information
router.put("/classes/:id", classesCtrl.updateClass);

// Delete a class
router.delete("/classes/:id", classesCtrl.deleteClass);

module.exports = router;





// const express = require("express");
// const router = express.Router();
// const { classesCtrl } = require("../controllers/classes.controller");

// router.get("/classes/:id",classesCtrl.gettClassById(_id)) 
// router.get("/classes/students",classesCtrl.getAllStudentsInClass(_id)) 
// router.get("/classes",classesCtrl.getAllClasses()) 
// router.get("/classes/places",classesCtrl.getAllPlaces()) 
// router.get("/classes/attendance",classesCtrl.getAttendance()) 
// router.get("/classes/attendance/:id",classesCtrl.getAttendanceForStudent(_id)) 
// router.get("/classes/distribution",classesCtrl.classAttendanceDistribution(_test_id)) 
// router.get("/classes/distribution/:id",classesCtrl.attendanceDistribution(_student_id)) 

// router.post("/classes/attendance",classesCtrl.fillClassAttendance())
// router.post("/classes/places",classesCtrl.addPlacesToClass())
// router.post("/classes",classesCtrl.addClass())

// router.put("/classes/attendance/:id",classesCtrl.updateAttendanceForStudent(_id))    
// router.put("/classes/addTeacherClass",classesCtrl.addClassToTeacher())    
// router.put("/classes/:id",classesCtrl.updateClass(_id))    

// router.delete("/classes/:id",classesCtrl.deleteClass(_id))