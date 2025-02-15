import Joi from "joi";

const variantBody = {
    name: Joi.string().max(30),
    stock: Joi.number().min(0),
    price: Joi.number().min(0),
    unit: Joi.string().min(1).max(15)
};
const bodySchema = Joi.object(variantBody);

const createVariantSchema = {
    body: bodySchema.fork(['name', 'stock', 'price', 'unit'], schema => schema.required()).required()
}
const editVariantSchema = {
    body: bodySchema.required()
}

export default {
    createVariant: createVariantSchema,
    editVariant: editVariantSchema,
    variantBody
};