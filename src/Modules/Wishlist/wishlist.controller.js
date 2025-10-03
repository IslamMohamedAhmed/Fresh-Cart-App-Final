import { userModel } from "../../../Database/Models/user.model.js";
import { catchError } from "../../Middlewares/catchError.js";
import { appError } from "../../Utils/appError.js";


const addToWishlist = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    let user = await userModel.findById(tokenUser.id);
    if (user.wishlist.length < 10) {
        let result = await userModel.findByIdAndUpdate(tokenUser.id, { $addToSet: { wishlist: req.body.product } }, { new: true }).populate('wishlist');
        res.json({ message: 'success', wishlist: result.wishlist });
    }
    else {
        next(new appError('Your wishlist is full, remove some elements to be able to add more!!', 401));
    }
});
const removeFromWishlist = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    let user = await userModel.findById(tokenUser.id);
    let elements = [...user.wishlist].filter(item => item == req.params.id);
    if (elements.length > 0) {
        let result = await userModel.findByIdAndUpdate(tokenUser.id, { $pull: { wishlist: req.params.id } }, { new: true }).populate('wishlist');
        res.json({ message: 'success', wishlist: result.wishlist });
    }
    else {
        next(new appError('product is not in the wishlist already!!', 401));
    }
});

const getWishlist = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    let user = await userModel.findById(tokenUser.id).populate('wishlist');
    res.json({ message: 'success', wishlist: user.wishlist });
});



export {
    addToWishlist,
    removeFromWishlist,
    getWishlist
}
