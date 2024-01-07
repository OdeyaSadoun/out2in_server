const Joi = require("joi");

exports.classValidate = (_reqBody) => {
  let classValidate = Joi.object({
    school_id: Joi.required(),
    name: Joi.string().min(2).max(50).required(),
    places: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      grade: Joi.string().required(),
    })),
    active: Joi.boolean().required(),
    date_created: Joi.date().default(new Date(), "current date"),


  });

  return classValidate.validate(_reqBody);
};
