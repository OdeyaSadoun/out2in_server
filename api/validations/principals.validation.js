const Joi = require("joi");

exports.principalValidate = (_reqBody) => {
  let principalValidate = Joi.object({
    seniority: Joi.number().min(0).max(100).required()
});

  return principalValidate.validate(_reqBody);
};
