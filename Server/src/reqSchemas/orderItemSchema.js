import Joi from "joi";
import { UUID } from "./common.js";

const orderItem = Joi.object({
    variantId: UUID.required(),
    quantity: Joi.number().integer().positive().required(),
    notes: Joi.string()
});

const updateSchema = {
    body: Joi.object({
        status: Joi.string().valid('PENDING', 'PROCESSING', 'READY', 'COMPLETED', 'CANCELLED').required()
    }).required()
}

export default {
    orderItem,
    update: updateSchema
};