import Joi from "joi";
import { UUID } from "./common.js";

const fetchFilteredSchema = {
    query: Joi.object({
        page: Joi.number().min(1),
        name: Joi.string(),
        category: Joi.string(),
        storeId: UUID,
        storeName: Joi.string()
    })
}

const bodySchema = Joi.object({
    name: Joi.string().min(1).max(50),
    description: Joi.string().min(1).max(400),
    category: Joi.string().min(1).max(40),
    price: Joi.number().min(0),
    unit: Joi.string().min(1).max(15),
    availability: Joi.string().valid('UNAVAILABLE', 'AVAILABLE', 'PREORDER'),

    variants: Joi.object().pattern(Joi.string(), Joi.array().items(Joi.string().min(1).max(50)))
})

const createProductSchema = {
    body: bodySchema.fork(['name', 'category', 'price', 'unit', 'availability'], schema => schema.required()).required(),
    files: Joi.array().exist()
}

const editProductSchema = {
    body: bodySchema.append({ 
        actionJson: Joi.string()
    }).required(),
    files: Joi.array()
}

export default {
    getProducts: fetchFilteredSchema,
    createProduct: createProductSchema,
    editProduct: editProductSchema
};