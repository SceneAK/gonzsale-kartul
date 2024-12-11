import Joi from "joi";

const getProductsSchema = {
    body: Joi.object({
    product_name: Joi.string(),
    product_category: Joi.string(),
    store_id: Joi.string().length(36),
    store_name: Joi.string(),
    })
}
const createProductSchema = {
    body: Joi.object({
    product_name: Joi.string().min(1).max(50).required(),
    product_description: Joi.string().min(1).max(400).required(),
    product_category: Joi.string().min(1).max(40).required(),
    product_variants: Joi.any().default("{}"),
    product_price: Joi.number().min(0).required(),
    product_unit: Joi.string().min(1).max(15).required(),
    product_availability: Joi.string().valid('UNAVAILABLE', 'AVAILABLE', 'PREORDER_ONLY').required()
    }).required(),
    files: Joi.array().exist() // Expects key name to be 'product_imgSrc'
}

const editProductSchema = {
    body: Joi.object({
    product_name: Joi.string().min(1).max(50),
    product_description: Joi.string().min(1).max(400),
    product_category: Joi.string().min(1).max(40),
    product_variants: Joi.any(),
    product_price: Joi.number().min(0),
    product_unit: Joi.string().min(1).max(15),
    product_availability: Joi.string().valid('UNAVAILABLE', 'AVAILABLE', 'PREORDER_ONLY')
    }).required(),
    files: Joi.array() // Expects key name to be 'product_imgSrc'
}

export default {
    getProducts: getProductsSchema,
    createProduct: createProductSchema,
    editProduct: editProductSchema
};