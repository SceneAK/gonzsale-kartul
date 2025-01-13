import Joi from "joi";

const placeOrderSchema = {
    body: Joi.object({
        productId: Joi.string().length(36).required(),
        qty: Joi.number().min(1).required(),
        order_variant: Joi.any().default("{}"),
        order_notes: Joi.string().max(150).default("no notes provided")
    }).required(),
    file: Joi.any().exist() // Expects key name to be 'transaction_proof'
}

const bodyExtra = Joi.object({
    name: Joi.string().required(),
    phone: Joi.number().min(1000 * 1000).max(100 * 1000 * 1000 * 1000 * 1000 * 1000).required(), 
    email: Joi.string().email().required()
});
const guestPlaceOrderSchema = {
    ...placeOrderSchema,
    body: placeOrderSchema.body.concat(bodyExtra).required(),
}

const updateSchema = {
    body: Joi.object({
        orderId: Joi.string().length(36).required(),
        orderStatus: Joi.string().valid('PROCESSING', 'IN_GONZAGA' ,'COMPLETED').required()
    }).required()
}

export default {
    placeOrder: placeOrderSchema,
    guestPlace: guestPlaceOrderSchema,
    update: updateSchema
};