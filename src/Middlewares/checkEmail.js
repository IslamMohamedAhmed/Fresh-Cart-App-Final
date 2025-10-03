import { userModel } from "../../Database/Models/user.model.js";
import { appError } from "../Utils/appError.js";

export const checkEmail = async (req, res, next) => {

    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
        return next(new appError("email already exists!", 409));
    }

    next();
};

