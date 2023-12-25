const Joi = require("joi");

exports.schoolsValidate = (_reqBody) => {
    let validate = Joi.object({
        // principle_id: Joi.string().min(9).max(3),
        name: Joi.string().max(50).required(),
        address: Joi.string().max(50).required(),
        phone: Joi.number().min(7).max(15).trim().required(),
        email: Joi.string().min(7).max(100).email().trim().lowercase().required()
    });
}