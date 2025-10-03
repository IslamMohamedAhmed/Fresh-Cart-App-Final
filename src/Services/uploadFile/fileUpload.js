import multer from "multer";
import { v4 as uuid } from 'uuid';
import { appError } from "../../Utils/appError.js";

export const uploadImages = (path) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path);
        },
        filename: function (req, file, cb) {
            cb(null, uuid() + '-' + file.originalname);
        }
    });

    function fileFilter(req, file, cb) {


        if (file.mimetype.startsWith('image')) {

            cb(null, true);
        }
        else {
            cb(new appError('wrong file type', 401), false)
        }
    }

    const upload = multer({ storage, fileFilter });
    return upload;
};

export const uploadSingle = (fieldName, path) => uploadImages(path).single(fieldName);
export const uploadArrayOfFiles = (fieldName, path) => uploadImages(path).array(fieldName);
export const uploadFields = (fields, path) => uploadImages(path).fields(fields);
