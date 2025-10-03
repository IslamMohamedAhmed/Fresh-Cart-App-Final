import { reviewModel } from "../../../Database/Models/review.model.js";
import { catchError } from "../../Middlewares/catchError.js";
import { appError } from "../../Utils/appError.js";
import { QueryBuilder } from "../../Utils/queryBuilder.js";


const addReview = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    let reviewExist = await reviewModel.findOne({ createdBy: tokenUser.id, product: req.body.product });
    if (reviewExist) {
        next(new appError('A review is created before for this product by the same user!!', 401));
    }
    else {
        req.body.createdBy = tokenUser.id;
        let review = new reviewModel(req.body);
        await review.save();
        res.json({ message: 'success', review });
    }
});

const getSingleReview = catchError(async (req, res, next) => {
    let review = await reviewModel.findById(req.params.id);
    res.json({ message: 'success', review });
});

const updateReview = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    let result = await reviewModel.findById(req.params.id);
    if (req.body.product) next(new appError('you are not authorized to update the product id as it\'s added 1 time'
        , 401));
    if (result.createdBy == tokenUser.id) {
        let review = await reviewModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: 'success', review });
    }
    else {

        next(new appError('you are not authorized to update that review', 401));
    }
});

const deleteReview = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    let result = await reviewModel.findById(req.params.id);
    if (result.createdBy == tokenUser.id || tokenUser.role == 'super admin' || tokenUser.role == 'admin') {
        let review = await reviewModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'success', review });
    }
    else {

        next(new appError('you are not authorized to delete that review', 401));
    }


});

const getAllReviews = catchError(async (req, res, next) => {
    let filter = {};
    if (req.params.product) filter.product = req.params.product;
    if (req.params.user) filter.createdBy = req.params.user;
    let queryBuilder = new QueryBuilder(reviewModel.find(filter), req.query);
    queryBuilder.filter().sort().fields().search();
    await queryBuilder.pagination();
    let reviews = await queryBuilder.mongooseQuery;
    res.json({
        message: "success",
        page: queryBuilder.pageNumber,
        totalPages: queryBuilder.totalPages,
        totalItems: queryBuilder.totalItems,
        pageLimit: queryBuilder.pageLimit,
        data: reviews                        // The actual data for this page
    });
});



export {
    addReview,
    updateReview,
    deleteReview,
    getAllReviews,
    getSingleReview
}
