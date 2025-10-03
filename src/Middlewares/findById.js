import { appError } from "../Utils/appError.js";

export const findById = (cases) => {
    return async (req, res, next) => {
            let id = req[cases.from]?.[cases.foreignKey];
            if (id) {
                let result = await cases.model.findById(id);
                if (result) {
                    next();
                }
                else {
                    next(new appError(`${cases.objectName} is not found!!`, 404));
                }

            }
            else {
                if (cases.necessary) return next(new appError(`${cases.foreignKey} is not provided!!`, 401));
                else next();
            }
    }

};
