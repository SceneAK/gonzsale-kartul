import Joi from "joi";
import { UUID } from "./common.js";

const createCODSchema = {
    body: Joi.object({
        orderId: UUID.required(),
        type: Joi.string().valid('PAYMENT', 'REFUND').required(),
        amount: Joi.number().positive().when('type', {
            is: 'REFUND', 
            then: Joi.required(), 
            otherwise: Joi.forbidden() 
        })
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