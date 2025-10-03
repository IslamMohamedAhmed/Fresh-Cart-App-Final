import { userModel } from "../../../Database/Models/user.model.js";
import { catchError } from "../../Middlewares/catchError.js";
import { appError } from "../../Utils/appError.js";


const addAddress = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    let user = await userModel.findById(tokenUser.id);
    if (user.addresses.length < 5) {
        let result = await userModel.findByIdAndUpdate(tokenUser.id, { $addToSet: { addresses: req.body } }, { new: true });
        res.json({ message: 'success', addresses: result.addresses });
    }
    else {
        next(new appError('Your addresses list is full, remove some addresses to be able to add more!!', 401));
    }
});
const updateAddress = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    let id = req.params.id;
    let updatedData = req.body;
    let setData = {};
    for (let key in updatedData) {
        setData[`addresses.$.${key}`] = updatedData[key];
    }
    let user = await userModel.findOneAndUpdate({ _id: tokenUser.id, "addresses._id": id }, { $set: setData }, { new: true });
    if (user) {
        res.json({ message: 'success', addresses: user.addresses });
    }
    else {
        return next(new appError('address is not found'));
    }
});
const removeAddress = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    let user = await userModel.findById(tokenUser.id);
    let elements = [...user.addresses].filter(item => item._id == req.params.id);
    console.log(elements);
    if (elements.length > 0) {
        let result = await userModel.findByIdAndUpdate(tokenUser.id, { $pull: { addresses: { _id: req.params.id } } }, { new: true });
        res.json({ message: 'success', addresses: result.addresses });
    }
    else {
        next(new appError('Address is not found!!', 401));
    }
});

const getAddresses = catchError(async (req, res, next) => {
    let tokenUser = req.headers['user-info'];
    let user = await userModel.findById(tokenUser.id);
    res.json({ message: 'success', addresses: user.addresses });
});



export {
    addAddress,
    removeAddress,
    getAddresses,
    updateAddress
}
