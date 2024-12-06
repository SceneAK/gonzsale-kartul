import Joi, { exist } from "joi";
const placeOrderSchema = {
    body: Joi.object({
        product_id: Joi.number().required(),
        order_qty: Joi.number().min(1).required(),
        order_variant: Joi.object().default({}),
        order_notes: Joi.string().max(150).required()
    }),
    file: Joi.object.exist()
}
const placeOrderGuestExtraSchema = {
    body: Joi.object({
        user_phone: Joi.number().min(6).max(15).required(), 
        user_email: Joi.string().email().required()
    }),
}

export default {
    placeOrder: placeOrderSchema,
    guestExtra: placeOrderGuestExtraSchema
};