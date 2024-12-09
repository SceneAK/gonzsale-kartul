import Joi from "joi";
const createStoreSchema = {
    body: Joi.object({
    store_name: Joi.string().min(3).max(20).required(),
    store_bank_account: Joi.string().min(10).max(16).required(),
    store_payment_method: Joi.string().max(10).required()
    }),
    file: Joi.any().exist() // Expects key name to be 'store_imgSrc'
}

export default {
    createStore: createStoreSchema
};