const express=require('express');
const router=express.Router();
const { auth, authRole } = require('../middleware/auth');
const { testsCtrl } = require('../controllers/tests.controller');

router.get ('/:id', auth, authRole(["teacher", "admin"]),testsCtrl.getTestById)
router.get ('//:testid', auth, authRole(["teacher", "admin"]),testsCtrl.getTestById)
router.post ('/addGrades',auth,authRole(["teacher", "admin"]),testsCtrl.addGrades);//grade send in body
router.patch ('/deleteTest/:testId',auth,authRole(["teacher", "admin"]),testsCtrl.deleteTest);//grade send in body

module.exports=router;
