const express = require("express");
const { auth, authAdmin } = require("../middleware/auth");
const { userlCtrl } = require("../controllers/users.controllers");
const { authCtrl } = require("../controllers/auth.controllers");
const router = express.Router();

router.post("/register/principal", authCtrl.registerPrincipal);
// auth,authRole,
router.post("/register/teacher", authCtrl.registerTeacher); 

router.post("/register/student", authCtrl.registerStudent);

router.post("/login", authCtrl.login);

router.get("/myInfo", auth, userlCtrl.getUserInfo);

router.get("/usersList", authAdmin, userlCtrl.getAllUsers);

router.put("/:idEdit", auth, userlCtrl.editUser);

router.delete("/:idDelete", auth, userlCtrl.deleteUser);

module.exports = router;
