import Joi from "joi";
import { UUID } from "./common.js";

const ORDER_ITEM = Joi.object({
    productId: UUID.required(),
    quantity: Joi.number().integer().positive().required(),
    notes: Joi.string()
});

const createOrderSchema = {
    body: Joi.object({
        OrderItems: Joi.array().min(1).items(ORDER_ITEM).required()
    }) 
}

const updateSchema = {
    body: Joi.object({
        orderItemId: UUID.required(),
        status: Joi.string().valid('UNCOMPLETED', 'READY', 'COMPLETED', 'CANCELED').required()
    }).required()
}

export default {
    createOrder: createOrderSchema,
    update: updateSchema
};