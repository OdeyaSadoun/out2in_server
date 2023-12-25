const Joi = require("joi");

exports.travelValidate = (_reqBody) => {
  let validate = Joi.object({
    train_name: Joi.string().max(3).required(),
    ticket: {
      payment_type: Joi.string().max(50).required(),
      price: Joi.number().min(1).max(300).required()
    }
  });

  return validate.validate(_reqBody);
};
