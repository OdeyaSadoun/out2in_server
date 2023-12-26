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

router.put("/edit/:idEdit", auth, userlCtrl.editUser);

router.patch("/delete/:idDelete", auth, userlCtrl.deleteUser);

router.patch("/changePassword", auth, authCtrl.changePassword);

router.patch("/active/:id", authCtrl.activeTrue);

module.exports = router;
