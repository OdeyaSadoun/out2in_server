const bcrypt = require("bcrypt");
const { createToken } = require("../helpers/auth.helper");
const { UserModel } = require("../models/users.model");
const { PrincipalModel } = require("../models/principals.model");
const { TeacherModel } = require("../models/teachers.model");
const { StudentModel } = require("../models/students.model");
const {
  registerValidate,
  loginValidate,
} = require("../validations/auth.validation");

exports.authCtrl = {
  registerPrincipal: async (req, res) => {
    let validBody = registerValidate(req.body.user);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      let objUser = { role: "principal", ...req.body.user };
      let user = new UserModel(objUser);
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      user.password = "********";

      let objPrincipal = { user_id: user._id, ...req.body.other };
      let principal = new PrincipalModel(objPrincipal);
      await principal.save();
      res.status(201).json(principal);
    } catch (err) {
      if (err.code == 11000) {
        return res
          .status(500)
          .json({ msg: "Id already in system, try log in", code: 11000 });
      }
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  registerTeacher: async (req, res) => {
    let validBody = registerValidate(req.body.user);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      let objUser = { role: "teacher", ...req.body.user };
      let user = new UserModel(objUser);
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      user.password = "********";

      let objTeacher = { user_id: user._id, ...req.body.other };
      let teacher = new TeacherModel(objTeacher);
      await teacher.save();
      res.status(201).json(teacher);
    } catch (err) {
      if (err.code == 11000) {
        return res
          .status(500)
          .json({ msg: "Id already in system, try log in", code: 11000 });
      }
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  registerStudent: async (req, res) => {
    let validBody = registerValidate(req.body.user);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      let objUser = { role: "student", ...req.body.user };
      let user = new UserModel(objUser);
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      user.password = "********";

      let objStudent = { user_id: user._id, ...req.body.other };
      let student = new StudentModel(objStudent);

      await student.save();
      res.status(201).json(student);
    } catch (err) {
      if (err.code == 11000) {
        return res
          .status(500)
          .json({ msg: "Id already in system, try log in", code: 11000 });
      }
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  login: async (req, res) => {
    let validBody = loginValidate(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      let user = await UserModel.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(401)
          .json({ msg: "There is no user with this email" });
      }
      let authPassword = await bcrypt.compare(req.body.password, user.password);
      if (!authPassword) {
        return res.status(401).json({ msg: "Wrong password" });
      }
      let token = createToken(user._id, user.role);
      res.cookie("access_token", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      });
      res.json({ token });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  logout: async (req, res) => {
    if (req.cookies.access_token != null) {
      res.clearCookie("access_token");
      return res.json("Cookie cleared");
    }
    res.status(400).json("log out failed no cookies");
  },
};
