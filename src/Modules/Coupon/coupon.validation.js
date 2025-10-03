import joi from "joi";

const validateAddCoupon = joi.object({
    code: joi.string().required().min(2).max(100).trim(),
    expiresAt: joi.required(),
    discount: joi.number().min(0).max(100).required().options({ convert: false })
}).unknown(true);

const validateUpdateCoupon = joi.object({
    code: joi.string().min(2).max(100).trim(),
    discount: joi.number().min(0).max(100).options({ convert: false })
}).unknown(true);

const validateParamsId = joi.object({
    id: joi.string().required().length(24).hex()
}).unknown(true);


export {
    validateAddCoupon,
    validateUpdateCoupon,
    validateParamsId
}


