import joi from "joi";

const validateAddReview = joi.object({
    text: joi.string().required().min(2).max(100).trim(),
    rate: joi.number().integer().required().min(0).max(5),
    product: joi.string().required().length(24).hex(),
}).unknown(true);

const validateUpdateReview = joi.object({
    id: joi.string().required().length(24).hex(),
    text: joi.string().min(2).max(100).trim(),
    rate: joi.number().integer().min(0).max(5),
}).unknown(true);

const validateParamsId = joi.object({
    id: joi.string().required().length(24).hex()
});



export {
    validateAddReview,
    validateUpdateReview,
    validateParamsId
}
