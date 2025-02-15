import Joi from "joi";
import { UUID } from "./common.js";
import variantSchema from './variantSchema.js';

const fetchFilteredSchema = {
    query: Joi.object({
        page: Joi.number().min(1),
        name: Joi.string(),
        category: Joi.string(),
        storeId: UUID,
        storeName: Joi.string()
    })
}
const productBody = {
    name: Joi.string().min(1).max(50),
    description: Joi.string().min(1).max(400),
    category: Joi.string().min(1).max(40),
    isAvailable: Joi.bool()
}
const bodySchema = Joi.object(productBody)

const createProductSchema = {
    body: bodySchema.fork(['name', 'category', 'isAvailable'], schema => schema.required()).append({
        defaultVariantData: variantSchema.createVariant.body.required()
    }).required()
}

const editProductSchema = {
    body: bodySchema.append({ 
        actionJson: Joi.string()
    }).required(),
    files: Joi.array()
}

export default {
    fetchFiltered: fetchFilteredSchema,
    createProduct: createProductSchema,
    editProduct: editProductSchema,
    productBody
};