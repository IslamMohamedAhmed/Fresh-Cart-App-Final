import joi from "joi";

const validateAddToCart = joi.object({
    product: joi.string().hex().length(24).required(), // since ObjectId is 24-char hex string
    quantity: joi.number().min(1).required().options({ convert: false }),
}).unknown(true);


const validateParamsId = joi.object({
    id: joi.string().required().length(24).hex()
}).unknown(true);

const validateUpdateQuantity = joi.object({
    id: joi.string().hex().length(24).required(), // since ObjectId is 24-char hex string
    quantity: joi.number().min(1).required().options({ convert: false })
}).unknown(true);
export {
    validateAddToCart,
    validateParamsId,
    validateUpdateQuantity
}


