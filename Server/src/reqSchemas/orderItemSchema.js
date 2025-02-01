import Joi from "joi";
import { UUID } from "./common.js";

const updateSchema = {
    body: Joi.object({
        status: Joi.string().valid('PENDING', 'PROCESSING', 'READY', 'COMPLETED', 'CANCELED').required()
    }).required()
}

export default {
    update: updateSchema
};