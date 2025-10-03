import joi from "joi";

const validateAddCategory = joi.object({
    name: joi.string().required().min(2).max(100).trim(),
    image: joi.object({
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
        size: joi.number().max(5242880).required(), // Max ~5MB
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required()
    }).required()
}).unknown(true);

const validateUpdateCategory = joi.object({
    name: joi.string().min(2).max(100).trim(),
    id: joi.string().required().length(24).hex(),
    image: joi.object({
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
        size: joi.number().max(5242880).required(), // Max ~5MB
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required()
    })
}).unknown(true);

const validateParamsId = joi.object({
    id: joi.string().required().length(24).hex()
});



export {
    validateAddCategory,
    validateUpdateCategory,
    validateParamsId
}