import { couponModel } from "../../../Database/Models/coupon.model.js";
import { catchError } from "../../Middlewares/catchError.js";
import { appError } from "../../Utils/appError.js";
import { QueryBuilder } from "../../Utils/queryBuilder.js";


const addCoupon = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    req.body.createdBy = tokenUser.id;
    let couponExist = await couponModel.findOne({ code: req.body.code });
    if (couponExist) {
        next(new appError('coupon code must be unique!!'));
    }
    else {
        let coupon = new couponModel(req.body);
        await coupon.save();
        res.json({ message: 'success', coupon });
    }
});

const getSingleCoupon = catchError(async (req, res, next) => {
    let coupon = await couponModel.findById(req.params.id);
    res.json({ message: 'success', coupon });
});

const updateCoupon = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    let result = await couponModel.findById(req.params.id);
    if (result.createdBy == tokenUser.id) {
        if (req.body.code) {
            let couponExist = await couponModel.findOne({ code: req.body.code });
            if (couponExist) {
                next(new appError('coupon code must be unique!!'));
            }
            else {
                let coupon = await couponModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
                res.json({ message: 'success', coupon });

            }
        } else {

            let coupon = await couponModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json({ message: 'success', coupon });
        }
    }
    else {
        next(new appError('you are not authorized to update that coupon', 401));
    }

});

const deleteCoupon = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    let result = await couponModel.findById(req.params.id);
    if (result.createdBy == tokenUser.id || tokenUser.role == 'super admin') {
        let coupon = await couponModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'success', coupon });
    }
    else {
        next(new appError('you are not authorized to delete that coupon', 401));
    }
});

const getAllCoupons = catchError(async (req, res, next) => {
    let queryBuilder = new QueryBuilder(couponModel.find(filter), req.query, ['code', 'expiresAt']);
    queryBuilder.filter().search().buildQuery().sort().fields();
    await queryBuilder.pagination();
    let coupons = await queryBuilder.mongooseQuery;
    res.json({
        message: "success",
        page: queryBuilder.pageNumber,
        totalPages: queryBuilder.totalPages,
        totalItems: queryBuilder.totalItems,
        pageLimit: queryBuilder.pageLimit,
        data: coupons                        // The actual data for this page
    });
});



export {
    addCoupon,
    deleteCoupon,
    updateCoupon,
    getSingleCoupon,
    getAllCoupons
}