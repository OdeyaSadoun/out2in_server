const Joi = require("joi");

exports.studentValidate = (_reqBody) => {
    let studentValidate = Joi.object({
        social_index: Joi.number().min(1).max(300).required(),
        last_questionnaire_answered_date: Joi.date().required(),
    });
    return studentValidate.validate(_reqBody)

}