import joi from "joi";

const validateAddToWishlist = joi.object({
    product: joi.string().required().length(24).hex(),
}).unknown(true);

const validateParamsId = joi.object({
    id: joi.string().required().length(24).hex()
}).unknown(true);



export {
    validateAddToWishlist,
    validateParamsId
}
