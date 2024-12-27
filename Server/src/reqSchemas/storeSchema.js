import Joi from "joi";

const createStoreSchema = {
    body: bodySchemaRequired.required(),
    files: filesSchema
}
const updateStoreSchema = {
    body: bodySchema.required(),
    files: filesSchema
}

const bodySchema = Joi.object({
    name: Joi.string().min(3).max(20),
    description: Joi.string().max(300),
    bankAccount: Joi.string().min(10).max(16),
    bankName: Joi.string().max(10)
});
const bodySchemaRequired = bodySchema.fork(['name', 'bankAccount', 'bankName'], schema => schema.required());

const filesSchema = Joi.object({
    image: Joi.any(),
    qrImage: Joi.any()
});

export default {
    createStore: createStoreSchema,
    updateStore: updateStoreSchema
};