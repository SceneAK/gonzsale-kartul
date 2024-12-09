import Joi from "joi";

const placeOrderSchema = {
    body: Joi.object({
        product_id: Joi.string().length(36).required(),
        order_qty: Joi.number().min(1).required(),
        order_variant: Joi.any().default("{}"),
        order_notes: Joi.string().max(150).default("no notes provided")
    }),
    file: Joi.any().exist() // Expects key name to be 'transaction_proof'
}

const bodyExtra = Joi.object({
    user_name: Joi.string().required(),
    user_phone: Joi.number().min(1000 * 1000).max(100 * 1000 * 1000 * 1000 * 1000 * 1000).required(), 
    user_email: Joi.string().email().required()
});
const guestPlaceOrderSchema = {
    ...placeOrderSchema,
    body: placeOrderSchema.body.concat(bodyExtra),
}

const updateSchema = {
    body: Joi.object({
        order_id: Joi.string().length(36).required(),
        order_status: Joi.string().valid('PROCESSING', 'IN_GONZAGA' ,'COMPLETED').required()
    })
}

export default {
    placeOrder: placeOrderSchema,
    guestPlace: guestPlaceOrderSchema,
    update: updateSchema
};