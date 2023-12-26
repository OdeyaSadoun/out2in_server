const Joi = require("joi");

exports.schoolsValidate = (_reqBody) => {
    let schoolsValidate = Joi.object({
        principal_id: Joi.string().min(2).max(100),
        name: Joi.string().max(50).required(),
        address: Joi.string().max(50).required(),
        phone: Joi.string().min(7).max(15).required(),
        email: Joi.string().min(7).max(100).email().lowercase().required()
    });
    return schoolsValidate.validate(_reqBody)

}