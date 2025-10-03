import { appError } from "../Utils/appError.js";

export const validateInputs = (schema, fileFieldNames = []) => {
    return (req, res, next) => {
        let filter = { ...req.params, ...req.headers, ...req.body, ...req.query };
        if (req.file && fileFieldNames.length == 1) {

            filter[fileFieldNames[0]] = req.file;
        }
        else if (req.files && fileFieldNames.length > 0) {
            fileFieldNames.forEach(field => {
                if (req.files[field]) {
                    filter[field] = req.files[field];
                }
            });
        }
        let { error } = schema.validate(filter, { abortEarly: false });
        if (error) {
            let errMessages = [];
            error.details.forEach(val => {
                errMessages.push(val.message);
            });
            next(new appError(errMessages, 401));
        }
        else {
            next();
        }
    };
};

