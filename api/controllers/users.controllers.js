const { userValidate } = require("../validations/users.validation");
const { UserModel } = require("../models/users.model");

exports.userlCtrl = {
  getUserInfo: async (req, res) => {
    try {
      let userInfo = await UserModel.findOne(
        { _id: req.tokenData._id },
        { password: 0 }
      );
      res.json(userInfo);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      let data = await UserModel.find({}, { password: 0 });
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err });
    }
  },

  editUser: async (req, res) => {
    let idEdit = req.params.idEdit;
    let validBody = userValidate(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      console.log(req.tokenData);
      let data;
      if (req.tokenData.role == "admin") {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        data = await UserModel.updateOne({ _id: idEdit }, req.body);
      } else if (idEdit == req.tokenData._id) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        data = await UserModel.updateOne({ _id: idEdit }, req.body);
      } else {
        data = [
          {
            status: "failed",
            msg: "You are trying to do an operation that is not enabled!",
          },
        ];
      }
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  },

  deleteUser: async (req, res) => {
    console.log("delete");
    let idDelete = req.params.idDelete;
    try {
      let data;
      if (req.tokenData.role == "admin") {
        data = await UserModel.deleteOne({ _id: idDelete });
      } else if (idDelete == req.tokenData._id) {
        data = await UserModel.deleteOne({ _id: idDelete });
      } else {
        data = [
          {
            status: "failed",
            msg: "You are trying to do an operation that is not enabled!",
          },
        ];
      }
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  },
};
