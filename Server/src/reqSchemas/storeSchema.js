import Joi from "joi";
const createStoreSchema = {
    body: Joi.object({
        store_name: Joi.string().min(3).max(20).required(),
        store_description: Joi.string().max(300).required(),
        store_bank_account: Joi.string().min(10).max(16).required(),
        store_payment_method: Joi.string().max(10).required()
    }),
    files: Joi.object().exist()
}
const updateStoreSchema = {
    body: Joi.object({
        store_name: Joi.string().min(3).max(20),
        store_description: Joi.string().max(300),
        store_bank_account: Joi.string().min(10).max(16),
        store_payment_method: Joi.string().max(10)
    }).unknown(false),
    files: Joi.object()
}

export default {
    createStore: createStoreSchema,
    updateStore: updateStoreSchema
};