import Joi from "joi";
import orderItemSchema from "./orderItemSchema.js";
import { UUID } from "./common.js";

const createOrderSchema = {
    body: Joi.object({
        OrderItems: Joi.array().min(1).items(orderItemSchema.orderItem).required()
    }).required() 
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