const Joi = require("joi");

exports.messageValidate = (_reqBody) => {
  let messageValidate = Joi.object({
    student_id: Joi.string().required(),
    teacher_id: Joi.string().required(),
    title: Joi.string().required(),
    value: Joi.string().required(),
    read: Joi.boolean().required(),
    active: Joi.boolean().required(),
    date_created: Joi.date().default(new Date(), "current date"),
  });

  return messageValidate.validate(_reqBody);
};
