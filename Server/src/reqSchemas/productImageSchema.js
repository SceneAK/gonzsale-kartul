import Joi from "joi";

const createProductImagesSchema = {
    files: Joi.array().max(4).required()
}

export default {
    createProductImages: createProductImagesSchema
}