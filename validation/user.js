const Joi = require('joi');

module.exports = {
    body: {
        fullName: Joi.object().keys({
            firstName: Joi.string().max(255).min(3).required(),
            lastName: Joi.string().max(255).min(3).required(),
        }),
        email: Joi.string().email().max(255).required(),
        password: Joi.string().min(6).max(30).required(),
    },
    params: {
        id: Joi.string().required(),
    },
}

module.exports.login = {
    body: {  email: Joi.string().email().max(255).required(),
        password: Joi.string().min(6).max(30).required(),

    }
}

module.exports.changePassword = {
    body: {
        oldPassword: Joi.string().min(6).max(30).required(),
        newPassword: Joi.string().min(6).max(30).required(),
        reEnterNewPassword: Joi.string().min(6).max(30).required(),
    }
}