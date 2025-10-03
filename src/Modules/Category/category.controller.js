import slugify from "slugify";
import { categoryModel } from "../../../Database/Models/category.model.js";
import { catchError } from "../../Middlewares/catchError.js";
import { appError } from "../../Utils/appError.js";
import { QueryBuilder } from "../../Utils/queryBuilder.js";

const addCategory = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    req.body.slug = slugify(req.body.name);
    req.body.image = req.file.filename;
    req.body.createdBy = tokenUser.id;
    let category = new categoryModel(req.body);
    await category.save();
    res.json({ message: 'success', category });
});

const getSingleCategory = catchError(async (req, res, next) => {
    let category = await categoryModel.findById(req.params.id);
    res.json({ message: 'success', category });
});

const updateCategory = catchError(async (req, res, next) => {
    if (req.body.name) req.body.slug = slugify(req.body.name);
    if (req.file) req.body.image = req.file.filename;
    let tokenUser = req.headers['user-info'];
    let result = await categoryModel.findById(req.params.id);

    if (result.createdBy == tokenUser.id) {
        let category = await categoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: 'success', category });
    }
    else {

        next(new appError('you are not authorized to update that category', 401));
    }


});

const deleteCategory = catchError(async (req, res, next) => {
    let result = await categoryModel.findById(req.params.id);
    let tokenUser = req.headers['user-info'];
    if (result.createdBy == tokenUser.id || tokenUser.role == 'super admin') {
        let category = await categoryModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'success', category });
    }
    else {

        next(new appError('you are not authorized to delete that category', 401));
    }

});

const getAllCategories = catchError(async (req, res, next) => {
    let filter = {};
    if (req.params.user) filter.createdBy = req.params.user;
    let queryBuilder = new QueryBuilder(categoryModel.find(filter), req.query);
    queryBuilder.filter().sort().fields().search();
    await queryBuilder.pagination();
    let categories = await queryBuilder.mongooseQuery;
    res.json({
        message: "success",
        page: queryBuilder.pageNumber,
        totalPages: queryBuilder.totalPages,
        totalItems: queryBuilder.totalItems,
        pageLimit: queryBuilder.pageLimit,
        data: categories                        // The actual data for this page
    });
});



export {
    addCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    getSingleCategory
}
