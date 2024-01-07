const Joi = require("joi");

exports.messageValidate = (_reqBody) => {
  let messageValidate = Joi.object({
    title: Joi.string().min(2).max(50).required(),
    value: Joi.string().min(2).max(500).required(),
    read: Joi.boolean().required(),
    active: Joi.boolean().required(),
    date_created: Joi.date().default(new Date(), "current date"),
  });

  return messageValidate.validate(_reqBody);
};
