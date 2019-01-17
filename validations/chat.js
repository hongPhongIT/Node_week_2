const Joi = require('joi');

module.exports = {
    body: {
        name: Joi.string().email().required(),
        chat: Joi.string().required()
    }
};