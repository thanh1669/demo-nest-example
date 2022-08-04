import * as Joi from 'joi';

export const ListValidator = Joi.object()
    .keys({
        skip: Joi.number()
            .default(0)
            .allow(null, ''),
        limit: Joi.number()
            .default(20)
            .allow(null, ''),
        nested: Joi.bool()
            .allow(),
    })
    .unknown(true)