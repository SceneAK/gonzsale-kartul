import Joi from "joi";
const getProductsSchema = {
    body: Joi.object({
    product_name: Joi.string.defaults(''),
    product_category: Joi.string.defaults(''),
    store_id: Joi.number.defaults(-1),
    store_name: Joi.string.defaults(''),
    })
}
const createProductSchema = {
    body: Joi.object({
    product_name: Joi.string().min(1).max(50).required(),
    product_description: Joi.string().min(1).max(400).required(),
    product_category: Joi.string().min(1).max(40).required(),
    product_price: Joi.number.min(0).required(),
    product_unit: Joi.string().min(1).max(15).required(),
    product_canOrder: Joi.bool.required(),
    }),
    files: Joi.object().exist()
}

export default {
    getProducts: getProductsSchema,
    createProduct: createProductSchema
};