import Joi from "joi";

const variantSchema = Joi.object({
    name: Joi.string().max(30),
    stock: Joi.number().min(0),
    price: Joi.number().min(0),
    unit: Joi.string().min(1).max(15)
});
const createVariantSchema = {
    body: variantSchema.fork(['name', 'stock', 'price', 'unit'], schema => schema.required()).required()
}
const editVariantSchema = {
    body: variantSchema.required()
}

export default {
    createVariant: createVariantSchema,
    editVariant: editVariantSchema
};