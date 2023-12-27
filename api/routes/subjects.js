const express=require('express');
const router=express.Router();
const {subjectsCtrl } = require('../controllers/subjects.controller');
const { auth, authRole } = require('../middleware/auth');

router.get('/',auth,authRole(["admin"]),subjectsCtrl.getAllSubjects);
router.get('/getSubjectByStudent/',auth,authRole(["teacher"]),subjectsCtrl.getSubjectsByStudentId);
router.post ('/',auth,authRole(["teacher"]),subjectsCtrl.addSubject);
router.patch ('/addGrade/:subId',auth,authRole(["teacher"]),subjectsCtrl.addGrade);//grade send in body

module.exports=router;