const express=require('express');
const router=express.Router();
const { auth, authRole } = require('../middleware/auth');
const { testsCtrl } = require('../controllers/tests.controller');

// router.get ('/:id', auth, authRole(["teacher", "admin"]),testsCtrl.getTestById)
router.get ('/:testId', auth, authRole(["teacher", "admin"]),testsCtrl.getTestById)
router.post ('/addGrades',auth,authRole(["teacher", "admin"]),testsCtrl.addGrades);//grade send in body
router.patch ('/deleteTest/:testId',auth,authRole(["teacher", "admin"]),testsCtrl.deleteTest);//grade send in body
// router.post ('/addTest',auth,authRole(["teacher"]),testsCtrl.addTest);//grade send in body
router.get('/balance/:studentId',auth,authRole(["teacher"]),testsCtrl.GetTestsBalanceByStudentId);//grade send in body with)
router.post ('/addGrades',auth,authRole(["teacher"]),testsCtrl.addGrades);//grade send in body

module.exports=router;
