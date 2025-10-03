import express from 'express';
import { validateInputs } from '../../Middlewares/validateInputs.js';
import { validateChangePassword, validateRequestResetPassword, validateResetPassword, validateSignin, validateSignup } from './auth.validation.js';
import { changePassword, requestResetPassword, resetPassword, signin, signup, verify } from './auth.controller.js';
import { checkEmail } from '../../Middlewares/checkEmail.js';
import { validateToken } from '../../Middlewares/validateToken.js';

const authRouter = express.Router();


authRouter.route('/signup').post(validateInputs(validateSignup), checkEmail, signup);
authRouter.route('/verify/:token').get(verify);
authRouter.route('/signin').post(validateInputs(validateSignin), signin);
authRouter.route('/changePassword').patch(validateToken, validateInputs(validateChangePassword), changePassword);
authRouter.route('/reset-password/:id').get(validateInputs(validateRequestResetPassword), requestResetPassword);
authRouter.route('/reset-password/:token').post(validateInputs(validateResetPassword), resetPassword);

export default authRouter;

