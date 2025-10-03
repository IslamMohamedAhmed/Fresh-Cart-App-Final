import { userModel } from "../../../Database/Models/user.model.js";
import { catchError } from "../../Middlewares/catchError.js";
import { appError } from "../../Utils/appError.js";
import { QueryBuilder } from "../../Utils/queryBuilder.js";


const addUser = catchError(async (req, res, next) => {
    req.body.passwordLatestChangeTime = Date.now();
    let user = new userModel(req.body);
    await user.save();
    res.json({ message: 'success', user });
});

const getSingleUser = catchError(async (req, res, next) => {
    let user = await userModel.findById(req.params.id);
    res.json({ message: 'success', user });
});

const updateUser = catchError(async (req, res, next) => {
    if (req.body.password) req.body.passwordLatestChangeTime = Date.now();
    let user = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'success', user });
});

const deleteUser = catchError(async (req, res, next) => {
    let user = await userModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'success', user });
});

const getAllUsers = catchError(async (req, res, next) => {
    let queryBuilder = new QueryBuilder(userModel.find(), req.query);
    queryBuilder.filter().sort().fields().search();
    await queryBuilder.pagination();
    let users = await queryBuilder.mongooseQuery;
    res.json({
        message: "success",
        page: queryBuilder.pageNumber,
        totalPages: queryBuilder.totalPages,
        totalItems: queryBuilder.totalItems,
        pageLimit: queryBuilder.pageLimit,
        data: users                        // The actual data for this page
    });
});



export {
    addUser,
    updateUser,
    deleteUser,
    getAllUsers,
    getSingleUser
}
