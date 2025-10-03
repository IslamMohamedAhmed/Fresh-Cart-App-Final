import slugify from "slugify";
import { catchError } from "../../Middlewares/catchError.js";
import { appError } from "../../Utils/appError.js";
import { brandModel } from "../../../Database/Models/brand.model.js";
import { QueryBuilder } from "../../Utils/queryBuilder.js";

const addBrand = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    req.body.slug = slugify(req.body.name);
    req.body.logo = req.file.filename;
    req.body.createdBy = tokenUser.id;
    let brand = new brandModel(req.body);
    await brand.save();
    res.json({ message: 'success', brand });
});

const getSingleBrand = catchError(async (req, res, next) => {
    let brand = await brandModel.findById(req.params.id);
    res.json({ message: 'success', brand });
});

const updateBrand = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    if (req.body.name) req.body.slug = slugify(req.body.name);
    if (req.file) req.body.logo = req.file.filename;
    let result = await brandModel.findById(req.params.id);
    if (result.createdBy == tokenUser.id) {
        let brand = await brandModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: 'success', brand });
    }
    else {

        next(new appError('you are not authorized to update that brand', 401));
    }
});

const deleteBrand = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    let result = await brandModel.findById(req.params.id);
    if (result.createdBy == tokenUser.id || tokenUser.role == 'super admin') {
        let brand = await brandModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'success', brand });
    }
    else {

        next(new appError('you are not authorized to delete that brand', 401));
    }

});

const getAllBrands = catchError(async (req, res, next) => {
    let filter = {};
    if (req.params.user) filter.createdBy = req.params.user;
    let queryBuilder = new QueryBuilder(brandModel.find(filter), req.query);
    queryBuilder.filter().sort().fields().search();
    await queryBuilder.pagination();
    let brands = await queryBuilder.mongooseQuery;
    res.json({
        message: "success",
        page: queryBuilder.pageNumber,
        totalPages: queryBuilder.totalPages,
        totalItems: queryBuilder.totalItems,
        pageLimit: queryBuilder.pageLimit,
        data: brands                        // The actual data for this page
    });
});



export {
    addBrand,
    updateBrand,
    deleteBrand,
    getAllBrands,
    getSingleBrand
}
