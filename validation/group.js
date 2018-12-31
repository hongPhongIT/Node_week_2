const Joi = require('joi');

module.exports = {
    body: {
        name: Joi.string().max(255).required(),
        author: Joi.string().required(),
        lastMessage: Joi.string().required(),
    },
    params: {
        id: Joi.string().required(),
    }
};