import Joi from "joi";

const variantBody = {
    name: Joi.string().max(30),
    stock: Joi.number().min(0),
    price: Joi.number().min(0),
    unit: Joi.string().min(1).max(15)
};
const bodySchema = Joi.object(variantBody);

const bodySchemaRequired = bodySchema.fork(['name', 'stock', 'price', 'unit'], schema => schema.required()).required();
const createVariantsSchema = {
    body: Joi.array().items(bodySchemaRequired)
}
const editVariantSchema = {
    body: bodySchema.required()
}

export default {
    createVariants: createVariantsSchema,
    editVariant: editVariantSchema,
    variantBody,
    bodySchema,
    bodySchemaRequired
};