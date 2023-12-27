const express=require('express');
const router=express.Router();
const {subjectsCtrl } = require('../controllers/subjects.controller');
const { auth, authRole } = require('../middleware/auth');

router.get('/',auth,authRole(["admin"]),subjectsCtrl.getAllSubjects);

module.exports=router;