const Joi = require("joi");
const { join } = require("path");

exports.registerValidate = (_reqBody) => {
  let userValidate = Joi.object({
    idCard:Joi.string().max(9).required(),
    name: Joi.string().min(2).max(50).required(),
    phone: Joi.string().min(2).max(20).required(),
    address:Joi.string().min(2).max(20).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
      birthDate:Joi.allow(),
      role:Joi.allow(),
      active:Joi.allow()

    
  });

  return userValidate.validate(_reqBody);
};

exports.loginValidate = (_reqBody) => {
  let userValidate = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });

  return userValidate.validate(_reqBody);
};
