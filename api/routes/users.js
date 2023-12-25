const express = require("express");
const { auth, authRole } = require("../middleware/auth");
const { userlCtrl } = require("../controllers/users.controller");
const { authCtrl } = require("../controllers/auth.controllers");
const router = express.Router();

router.post("/register/principal", authCtrl.registerPrincipal);

router.post("/register/teacher",auth,authRole("principal"), authCtrl.registerTeacher); 

router.post("/register/student",auth,authRole("teacher"), authCtrl.registerStudent);

router.post("/login", authCtrl.login);

router.post("/logout", authCtrl.logout);

// router.get("/myInfo", auth, userlCtrl.getUserInfo);

router.get("/usersList",auth,authRole("admin"), userlCtrl.getAllUsers);

router.put("/:idEdit", auth, userlCtrl.editUser);

router.patch("/:idDelete", auth, userlCtrl.deleteUser);

module.exports = router;
