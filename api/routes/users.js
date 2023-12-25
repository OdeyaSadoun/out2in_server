const express = require("express");
const { auth, authAdmin } = require("../middleware/auth");
const { userlCtrl } = require("../controllers/users.controllers");
const { authCtrl } = require("../controllers/auth.controllers");
const router = express.Router();

router.get("/myInfo", auth, userlCtrl.getUserInfo);

router.get("/usersList", authAdmin, userlCtrl.getAllUsers);

router.post("/", authCtrl.register);

router.post("/login", authCtrl.login);

router.put("/:idEdit", auth, userlCtrl.editUser);

router.delete("/:idDelete", auth, userlCtrl.deleteUser);

module.exports = router;
