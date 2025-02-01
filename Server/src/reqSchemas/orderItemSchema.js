import Joi from "joi";
import { UUID } from "./common.js";

const orderItem = Joi.object({
    productId: UUID.required(),
    quantity: Joi.number().integer().positive().required(),
    notes: Joi.string()
});

const updateSchema = {
    body: Joi.object({
        status: Joi.string().valid('PENDING', 'PROCESSING', 'READY', 'COMPLETED', 'CANCELED').required()
    }).required()
}

export default {
    orderItem,
    update: updateSchema
};