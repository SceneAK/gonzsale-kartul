import Joi from "joi";
const createStoreSchema = {
    body: Joi.object({
    store_name: Joi.string().min(3).max(20).required(),
    owner_user_id: Joi.number()
    }),
    file: Joi.any().exist() // Expects key name to be 'store_imgSrc'
}

export default {
    createStore: createStoreSchema
};