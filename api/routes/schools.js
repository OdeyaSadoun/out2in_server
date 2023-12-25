


const express = require("express");
const router = express.Router();
const { schoolsCtrl } = require("../controllers/schools.controller");

router.get("/",schoolsCtrl.getAllSchools);
router.get("/:id",schoolsCtrl.getSchoolById);


module.exports = router;
