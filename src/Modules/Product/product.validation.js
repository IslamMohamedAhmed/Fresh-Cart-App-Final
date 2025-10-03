import joi from "joi";

const validateAddProduct = joi.object({
    title: joi.string().min(2).max(300).required().trim(),
    description: joi.string().min(10).max(1500).required().trim(),
    price: joi.number().min(0).required(),
    quantity: joi.number().min(0).optional(),
    category: joi.string().hex().length(24).required(),
    subcategory: joi.string().hex().length(24).required(),
    brand: joi.string().hex().length(24).required(),
    imageCover: joi.array().items(joi.object({
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
        size: joi.number().max(5242880).required(), // Max ~5MB
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required()
    })).required(),
    images: joi.array().items(joi.object({
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
        size: joi.number().max(5242880).required(), // Max ~5MB
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required()
    })).required()
}).unknown(true);

const validateUpdateProduct = joi.object({
    title: joi.string().min(2).max(300).trim(),
    description: joi.string().min(10).max(1500).trim(),
    price: joi.number().min(0),
    priceAfterDiscount: joi.number().min(0).optional(),
    quantity: joi.number().min(0).optional(),
    category: joi.string().hex().length(24),
    subcategory: joi.string().hex().length(24),
    brand: joi.string().hex().length(24),
    id: joi.string().required().length(24).hex(),
    imageCover: joi.array().items(joi.object({
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
        size: joi.number().max(5242880).required(), // Max ~5MB
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required()
    })),
    images: joi.array().items(joi.object({
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
        size: joi.number().max(5242880).required(), // Max ~5MB
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required()
    }))
}).unknown(true);

const validateParamsId = joi.object({
    id: joi.string().required().length(24).hex()
}).unknown(true);



export {
    validateAddProduct,
    validateUpdateProduct,
    validateParamsId
}