const express=require('express');
const router=express.Router();
const {subjectsCtrl } = require('../controllers/subjects.controller');
const { auth, authRole } = require('../middleware/auth');

router.get('/',auth,authRole(["admin"]),subjectsCtrl.getAllSubjects);
router.get('/getSubjecstByStudent/',auth,authRole(["teacher"]),subjectsCtrl.getSubjectsByStudentId);
router.get('/getSubjecstById/:subId',auth,authRole(["principal", "teacher"]),subjectsCtrl.getSubjectsById);
router.post ('/',auth, authRole(["teacher"]),subjectsCtrl.addSubject); // add subject to subjects array
router.patch ('/addGrade/:subId',auth,authRole(["teacher"]),subjectsCtrl.addGrade);//grade send in body

module.exports=router;


//teacher -> list of subjects -> each subject has list of classes, each class has class id, list of tests - > list students each student have mark