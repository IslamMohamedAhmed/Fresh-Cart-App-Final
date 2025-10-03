import { userModel } from "../../../Database/Models/user.model.js";
import { catchError } from "../../Middlewares/catchError.js";
import { sendEmail } from "../../Services/email/sendEmail.js";
import jwt from 'jsonwebtoken';
import { appError } from "../../Utils/appError.js";
import bcrypt from 'bcrypt';
const signup = catchError(async (req, res) => {
    req.body.passwordLatestChangeTime = Date.now();
    await userModel.create(req.body);
    sendEmail(req.body.email);
    res.json({ message: 'success' });
});

const verify = catchError(async (req, res, next) => {
    jwt.verify(req.params.token, process.env.JWT_KEY_SIGNUP, async (err, decoded) => {
        if (err) return next(new appError(err, 401));
        await userModel.findOneAndUpdate({ email: decoded.email }, { isVerified: true });
        res.json({ message: "Verification Succeeded" });
    });
});

const signin = catchError(async (req, res, next) => {
    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
        const match = bcrypt.compareSync(req.body.password, user.password);
        if (match && user.isVerified) {
            let token = jwt.sign({
                userInfo: {
                    id: user._id, email: user.email, role: user.role,
                    verified: user.isVerified, blocked: user.isBlocked
                }
            }, process.env.JWT_KEY_SIGNIN);
            return res.json({ message: "Sign in Succeeded!!", token });
        }
    }
    return next(new appError("Email or password are incorrect!!", 401));
});

const requestResetPassword = catchError(async (req, res, next) => {
    let user = await userModel.findOne({ email: req.body.email });
    if (user) {
        let token = jwt.sign({ userId: req.params.id, userEmail: user.email }, process.env.JWT_KEY_RESET_PASSWORD, { expiresIn: "24h" });
        res.json({ message: "success", token });
    }
    else {
        next(new appError("user is not found!!", 404));
    }
});

const resetPassword = catchError(async (req, res, next) => {
    jwt.verify(req.params.token, process.env.JWT_KEY_RESET_PASSWORD, async (err, decoded) => {
        if (err) return next(new appError(err, 401));
        await userModel.findOneAndUpdate({ email: decoded.userEmail }, { password: req.body.password, passwordLatestChangeTime: Date.now() });
        res.json({ message: "Password was updated successfully" });
    });
});

const changePassword = catchError(async (req, res, next) => {
    let user = await userModel.findById(req.headers['user-info'].id);
    if (user && bcrypt.compareSync(req.body.oldPassword, user.password)) {
        let token = jwt.sign(
            {
                userInfo: {
                    id: user._id, email: user.email, role: user.role,
                    verified: user.isVerified, blocked: user.isBlocked
                }
            },
            process.env.JWT_KEY_SIGNIN
        );

        await userModel.findByIdAndUpdate(req.headers['user-info'].id, {
            password: req.body.newPassword,
            passwordLatestChangeTime: Date.now()
        });

        return res.json({ message: "success", token });
    }

    next(new appError("incorrect email or password", 401));
});

export {
    signup,
    verify,
    signin,
    requestResetPassword,
    resetPassword,
    changePassword
}