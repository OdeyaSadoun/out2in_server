const { UserModel } = require("../models/users.model");

exports.getUserInfo = async(req, res, next) => {
    try {
        let userInfo = await UserModel.findOne(
          { _id: req.tokenData._id },
          { password: 0 }
        );
        req.userInfo = userInfo;
      next();
      } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err });
      }
   
  };