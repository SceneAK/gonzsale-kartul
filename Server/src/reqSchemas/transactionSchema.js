import Joi from "joi";
import { UUID } from "./common.js";

const createCODSchema = {
    body: Joi.object({
        orderId: UUID.required(),
        type: Joi.string().valid('PAYMENT', 'REFUND').required()
    }).required()
}
const createProofSchema = {
    body: createCODSchema.body.required(),
    file: Joi.object().required()
}

export default {
    createCOD: createCODSchema, 
    createProof: createProofSchema 
};