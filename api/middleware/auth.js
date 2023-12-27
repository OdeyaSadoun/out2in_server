const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

exports.authRole = (roles) => {
  return (req, res, next) => {
    let token = req.header("x-api-key");
    try {
      let decodeToken = jwt.verify(token, config.tokenSecret);
      if (roles.indexOf(decodeToken.role) == -1) {
        return res
          .status(401)
          .json({ msg: "Token invalid or expired, code: 6A" });
      }
      next();
    } catch (err) {
      console.log(err);
      return res
        .status(401)
        .json({ msg: "Token invalid or expired, log in again or you hacker!" });
    }
  };
};

exports.auth = (req, res, next) => {
  console.log(req.header);
  let token = req.header("x-api-key");
  console.log(token);
  if (!token) {
    return res
      .status(401)
      .json({ msg: "You need to send token to this endpoint url" });
  }
  try {
    let decodeToken = jwt.verify(token, config.tokenSecret);
    req.tokenData = decodeToken;
    next();
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json({ msg: "Token invalid or expired, log in again or you hacker!" });
  }
};

exports.authAdmin = (req, res, next) => {
  // let token = req.header("x-api-key");
  // if (!token) {
  //   return res
  //     .status(401)
  //     .json({ msg: "You need to send token to this endpoint url" });
  // }
  // try {
  //   let decodeToken = jwt.verify(token, config.tokenSecret);
  //   req.tokenData = decodeToken;
  //   next();
  // } catch (err) {
  //   console.log(err);
  //   return res
  //     .status(401)
  //     .json({ msg: "Token invalid or expired, log in again or you hacker!" });
  // }
};
