import slugify from "slugify";
import { catchError } from "../../Middlewares/catchError.js";
import { subCategoryModel } from "../../../Database/Models/subCategory.model.js";
import { appError } from "../../Utils/appError.js";
import { QueryBuilder } from "../../Utils/queryBuilder.js";


const addSubCategory = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    req.body.slug = slugify(req.body.name);
    req.body.createdBy = tokenUser.id;
    let subcategory = new subCategoryModel(req.body);
    await subcategory.save();
    res.json({ message: 'success', subcategory });
});

const getSingleSubCategory = catchError(async (req, res, next) => {
    let subcategory = await subCategoryModel.findById(req.params.id);
    res.json({ message: 'success', subcategory });
});

const updateSubCategory = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    if (req.body.name) req.body.slug = slugify(req.body.name);
    let result = await subCategoryModel.findById(req.params.id);
    if (result.createdBy == tokenUser.id) {
        let subcategory = await subCategoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: 'success', subcategory });
    }
    else {

        next(new appError('you are not authorized to update that subcategory', 401));
    }
});

const deleteSubCategory = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    let result = await subCategoryModel.findById(req.params.id);
    if (result.createdBy == tokenUser.id || tokenUser.role == 'super admin') {
        let subcategory = await subCategoryModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'success', subcategory });
    }
    else {

        next(new appError('you are not authorized to delete that subcategory', 401));
    }


});

const getAllSubCategories = catchError(async (req, res, next) => {
    let filter = {};
    if (req.params.category) filter.category = req.params.category;
    if (req.params.user) filter.createdBy = req.params.user;
    let queryBuilder = new QueryBuilder(subCategoryModel.find(filter), req.query);
    queryBuilder.filter().sort().fields().search();
    await queryBuilder.pagination();
    let subcategories = await queryBuilder.mongooseQuery;
    res.json({
        message: "success",
        page: queryBuilder.pageNumber,
        totalPages: queryBuilder.totalPages,
        totalItems: queryBuilder.totalItems,
        pageLimit: queryBuilder.pageLimit,
        data: subcategories                        // The actual data for this page
    });
});



export {
    addSubCategory,
    updateSubCategory,
    deleteSubCategory,
    getAllSubCategories,
    getSingleSubCategory
}
