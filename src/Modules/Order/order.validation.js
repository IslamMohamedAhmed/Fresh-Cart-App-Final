import joi from "joi";

const validateCreateOrder = joi.object({
    shippingAddress: joi.object({
        street: joi.string().trim().required(),
        city: joi.string().trim().required(),
        phone: joi.string().trim().required().pattern(/^01[0125][0-9]{8}$/)
    }).required()
}).unknown(true);


const validateParamsId = joi.object({
    id: joi.string().required().length(24).hex()
}).unknown(true);

export {
    validateCreateOrder,
    validateParamsId
}


