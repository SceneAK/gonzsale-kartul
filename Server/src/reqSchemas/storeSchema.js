import Joi from "joi";

const bodySchema = Joi.object({
    name: Joi.string().min(3).max(20),
    description: Joi.string().max(300),
    bankAccount: Joi.string().min(10).max(16),
    bankName: Joi.string().max(10)
});

const bodySchemaRequired = bodySchema.fork(['name', 'bankAccount', 'bankName'], schema => schema.required());

const createStoreSchema = {
    body: bodySchemaRequired.required(),
    files: Joi.object({
        imageFile: Joi.any().required(),
        qrImageFile: Joi.any()
    }).required()
}

const updateStoreSchema = {
    body: bodySchema.append({
        imageAction: Joi.string().valid('keep', 'replace'),
        qrImageAction: Joi.string().valid('keep', 'delete', 'replace')
    }).required(),
}

const updateStoreImageSchema = {
    file: Joi.any().required()
}

export default {
    createStore: createStoreSchema,
    updateStore: updateStoreSchema,
    updateStoreImage: updateStoreImageSchema
};