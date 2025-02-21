import Joi from "joi";
import { UUID } from "./common.js";
import productSchema from "./productSchema.js";
import variantSchema from "./variantSchema.js";

const orderItem = Joi.object({
    variantId: UUID.required(),
    quantity: Joi.number().integer().positive().required(),
    notes: Joi.string()
});

const filterQuerySchema = {
    query: Joi.object({
        variantId: UUID,
        variantName: variantSchema.variantBody.name,
        productName: productSchema.productBody.name,
        notes: Joi.string().max(999)
    }).required()
}

export default {
    orderItem,
    filterQuery: filterQuerySchema
};