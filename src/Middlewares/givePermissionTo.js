import { appError } from "../Utils/appError.js";


export const givePermissionTo = (...roles) => {
    return (req, res, next) => {
        let user = req.headers['user-info'];
        let allowed = roles.includes(user.role);
        let test = allowed && !user.blocked && user.verified;
        if (!test) return next(new appError('user is not allowed to do this action!!', 401));
        next()
    };
};
