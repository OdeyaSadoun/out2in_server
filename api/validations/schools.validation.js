const Joi = require("joi");

exports.schoolsValidate = (_reqBody) => {
    let schoolsValidate = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        address: Joi.string().min(2).max(50).required(),
        phone: Joi.string().min(7).max(15).required(),
        email: Joi.string().min(7).max(100).email().lowercase().required()
    });
    return schoolsValidate.validate(_reqBody)

}