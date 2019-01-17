const Joi = require('joi');

module.exports = {
    body: {
        message: Joi.string().max(255).required(),
        group: Joi.string().required().regex(/^(?=[a-f\\d]{24}$)(\\d+[a-f]|[a-f]+\\d)/i),
    },
    params: {
        id: Joi.string().required(),
    }
}