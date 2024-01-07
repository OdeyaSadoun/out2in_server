const express=require('express');
const router=express.Router();
const {subjectsCtrl } = require('../controllers/subjects.controller');
const { auth, authRole } = require('../middleware/auth');
const { testsCtrl } = require('../controllers/tests.controller');

router.get('/',auth,authRole(["admin"]),subjectsCtrl.getAllSubjects);

router.get('/getSubjecstByStudent/',auth,authRole(["admin","teacher"]),subjectsCtrl.getSubjectsByStudentId);
router.get('/getCurrentSubject/:subId',auth,authRole(["admin","teacher"]),subjectsCtrl.getCurrentSubject);

router.get('/getSubjectsByClassId/:classId',auth,authRole(["principal", "teacher"]),subjectsCtrl.getSubjectsByClassId);

router.post ('/',auth, authRole(["teacher"]),subjectsCtrl.addSubject); // add subject to subjects array

router.post ('/addGrades',auth,authRole(["teacher"]),testsCtrl.addGrades);//grade send in body

router.post ('/addSubject',auth,authRole(["teacher"]),subjectsCtrl.addSubject);//grade send in body

router.patch ('/addTestToSubject/:subId',auth,authRole(["teacher"]),testsCtrl.addTestToSubject);//grade send in body

router.patch ('/addSubjectToClass/:classId',auth,authRole(["teacher"]),subjectsCtrl.addSubjectToClass);//grade send in body

router.patch ('/deleteSubject/:subId',auth,authRole(["teacher"]),subjectsCtrl.deleteSubjectById);//delete

module.exports=router;


//teacher -> list of subjects -> each subject has list of classes, each class has class id, list of tests - > list students each student have mark