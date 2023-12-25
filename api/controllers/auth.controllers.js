const bcrypt = require("bcrypt");
const { createToken } = require("../helpers/auth.helper");
const { UserModel } = require("../models/users.model");
const { registerValidate, loginValidate } = require("../validations/auth.validation");

exports.authCtrl = {
  register: async (req, res) => {
    let validBody = registerValidate(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      let user = new UserModel(req.body);
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      user.password = "********";
      res.status(201).json(user);
    } catch (err) {
      if (err.code == 11000) {
        return res
          .status(500)
          .json({ msg: "Email already in system, try log in", code: 11000 });
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
          .json({ msg: "Password or email is worng ,code:1" });
      }
      let authPassword = await bcrypt.compare(req.body.password, user.password);
      if (!authPassword) {
        return res
          .status(401)
          .json({ msg: "Password or email is worng ,code:2" });
      }
      let token = createToken(user._id, user.role);
      res.json({ token });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },
};
