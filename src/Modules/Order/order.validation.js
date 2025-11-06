import joi from "joi";

const validateCreateOrder = joi.object({
    shippingAddress: joi.string().required().length(24).hex()
}).unknown(true);


const validateParamsId = joi.object({
    id: joi.string().required().length(24).hex()
}).unknown(true);

export {
    validateCreateOrder,
    validateParamsId
}


