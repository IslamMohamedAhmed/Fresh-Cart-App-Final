import joi from "joi";

const validateAddSubCategory = joi.object({
    name: joi.string().required().min(2).max(100).trim(),
    category: joi.string().required().length(24).hex(),
}).unknown(true);

const validateUpdateSubCategory = joi.object({
    name: joi.string().min(2).max(100).trim(),
    id: joi.string().required().length(24).hex(),
    category: joi.string().length(24).hex(),
}).unknown(true);

const validateParamsId = joi.object({
    id: joi.string().required().length(24).hex()
}).unknown(true);



export {
    validateAddSubCategory,
    validateUpdateSubCategory,
    validateParamsId,
}
