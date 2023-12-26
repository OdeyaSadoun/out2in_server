


const express = require("express");
const router = express.Router();
const { schoolsCtrl } = require("../controllers/schools.controller");
const { authRole, auth } = require("../middleware/auth");

router.get("/",auth,authRole(["admin"]),schoolsCtrl.getAllSchools);
router.get("/:id",auth,authRole(["admin","principal"]),schoolsCtrl.getSchoolById);
router.post("/",auth,authRole(["admin","principal"]),schoolsCtrl.addSchool);
router.put("/:id",auth,authRole(["admin","principal"]),schoolsCtrl.updateSchool);
router.patch("/deleteSchool/:id",auth,authRole(["admin","principal"]),schoolsCtrl.changeActive);


module.exports = router;
