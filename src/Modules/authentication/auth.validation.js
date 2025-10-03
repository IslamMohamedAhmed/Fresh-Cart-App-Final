import joi from 'joi';


const validateSignup = joi.object({
    name: joi.string().min(2).max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/).required()
}).unknown(true);

const validateSignin = joi.object({
    email: joi.string().email().required(),
    password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/).required(),
}).unknown(true);

const validateRequestResetPassword = joi.object({
    email: joi.string().email().required()
}).unknown(true);

const validateResetPassword = joi.object({
    token: joi.string(),
    password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/).required(),
}).unknown(true);

const validateChangePassword = joi.object({
    oldPassword: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/).required(),
    newPassword: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/).required(),
}).unknown(true);



export {
    validateSignup,
    validateSignin,
    validateRequestResetPassword,
    validateResetPassword,
    validateChangePassword
}