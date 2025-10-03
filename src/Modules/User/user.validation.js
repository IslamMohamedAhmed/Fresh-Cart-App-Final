import joi from "joi";

const validateAddUser = joi.object({
    name: joi.string().min(2).max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/).required(),
    role: joi.string().valid('user', 'admin'),
}).unknown(true);

const validateUpdateUser = joi.object({
    name: joi.string().min(2).max(20),
    email: joi.string().email(),
    password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/),
    role: joi.string().valid('user', 'admin'),
    id: joi.string().required().length(24).hex(),
}).unknown(true);

const validateParamsId = joi.object({
    id: joi.string().required().length(24).hex(),
}).unknown(true);

export {
    validateAddUser,
    validateUpdateUser,
    validateParamsId
}
