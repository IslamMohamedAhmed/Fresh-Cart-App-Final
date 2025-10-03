import express from "express";
import { validateInputs } from "../../Middlewares/validateInputs.js";
import { validateToken } from "../../Middlewares/validateToken.js";
import { addAddress, getAddresses, removeAddress, updateAddress } from "./Address.controller.js";
import { validateAddAddress, validateParamsId, validateUpdateAddress } from './address.validation.js';

const addressRouter = express.Router();
addressRouter.use(validateToken);
addressRouter.route('/').patch(validateInputs(validateAddAddress), addAddress)
    .get(getAddresses);
addressRouter.route('/:id').delete(validateInputs(validateParamsId), removeAddress).put(validateInputs(validateUpdateAddress), updateAddress);
export default addressRouter;



