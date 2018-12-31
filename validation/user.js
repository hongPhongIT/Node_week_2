const Joi = require('joi');

module.exports = {
    body: {
        firstName: Joi.string().max(255).required(),
        lastName: Joi.string().max(255).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(30).required(),
    },
    params: {
        id: Joi.string().required(),
    }
};