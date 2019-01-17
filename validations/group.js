const Joi = require('joi');

const member = Joi.string().required().regex(/^(?=[a-f\\d]{24}$)(\\d+[a-f]|[a-f]+\\d)/i);

module.exports = {
    body: {
        name: Joi.string().max(255).required(),
        author: Joi.string().required().regex(/^(?=[a-f\\d]{24}$)(\\d+[a-f]|[a-f]+\\d)/i),
        lastMessage: Joi.string().required().regex(/^(?=[a-f\\d]{24}$)(\\d+[a-f]|[a-f]+\\d)/i),
        members: Joi.array().items(member),
    },
    params: {
        id: Joi.string().required().regex(/^(?=[a-f\\d]{24}$)(\\d+[a-f]|[a-f]+\\d)/i),
    },
    bodyForUpdate: {
        name: Joi.string().max(255),
        author: Joi.string().regex(/^(?=[a-f\\d]{24}$)(\\d+[a-f]|[a-f]+\\d)/i),
        lastMessage: Joi.string().regex(/^(?=[a-f\\d]{24}$)(\\d+[a-f]|[a-f]+\\d)/i),
        members: Joi.array().items(member),
    },
    query: {
        page: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(2).max(10),
    }
};