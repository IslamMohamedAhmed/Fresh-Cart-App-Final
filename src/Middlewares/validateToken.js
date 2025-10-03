import jwt from 'jsonwebtoken';
import { appError } from '../Utils/appError.js';
import { userModel } from '../../Database/Models/user.model.js';

export const validateToken = async (req, res, next) => {
    let token = req.headers['token'];
    if (!token) return next(new appError('token is not provided!!', 401));
    jwt.verify(token, process.env.JWT_KEY_SIGNIN, async (err, decoded) => {
        if (err) return next(new appError(err, 401));
        let user = await userModel.findById(decoded.userInfo.id);
        if (!user) return next(new appError('user is not found!!'));
        let time = parseInt(user?.passwordLatestChangeTime.getTime() / 1000);
        if (time > decoded.iat) return next(new appError('invalid token, please login again!!', 401));
        req.headers['user-info'] = decoded.userInfo;
        next();
    });
}
