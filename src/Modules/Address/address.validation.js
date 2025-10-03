import joi from "joi";

const validateAddAddress = joi.object({
    street: joi.string().required().trim(),
    phone: joi.string().required().trim(),
    city: joi.string().required().trim(),
}).unknown(true);

const validateUpdateAddress = joi.object({
    street: joi.string().trim(),
    phone: joi.string().trim(),
    city: joi.string().trim(),
}).unknown(true);

const validateParamsId = joi.object({
    id: joi.string().required().length(24).hex()
}).unknown(true);



export {
    validateAddAddress,
    validateUpdateAddress,
    validateParamsId
}
