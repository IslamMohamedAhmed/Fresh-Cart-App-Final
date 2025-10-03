import { appError } from "../Utils/appError.js";

export const invalidPathHandler = (req, res, next) => {
    const error = new appError(`❌ Route not found: ${req.originalUrl}`, 404);
    next(error);
};