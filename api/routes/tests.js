const express=require('express');
const router=express.Router();
const {subjectsCtrl } = require('../controllers/subjects.controller');
const { auth, authRole } = require('../middleware/auth');
const { testsCtrl } = require('../controllers/tests.controller');

// router.post ('/addTest',auth,authRole(["teacher"]),testsCtrl.addTest);//grade send in body

router.post ('/addGrades',auth,authRole(["teacher"]),testsCtrl.addGrades);//grade send in body

module.exports=router;
