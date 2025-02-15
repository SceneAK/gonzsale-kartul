import Joi from "joi";
import orderItemSchema from "./orderItemSchema.js";
import userSchema from "./userSchema.js";
import { UUID } from "./common.js";
import variantSchema from "./variantSchema.js";
import productSchema from "./productSchema.js";

const createOrderSchema = (req) => ({
    body: Joi.object({
        OrderItems: Joi.array().min(1).items(orderItemSchema.orderItem).required(),
        customerDetails: req.decodedAuthToken ? Joi.forbidden() : Joi.object(customerDetails).required()
    }).required() 
})

const customerDetails = {
    customerName: userSchema.contacts.name,
    customerEmail: userSchema.contacts.email,
    customerPhone: userSchema.contacts.phone,
}

const updateSchema = {
    body: Joi.object({
        orderItemId: UUID.required(),
        status: Joi.string().valid('UNCOMPLETED', 'READY', 'COMPLETED', 'CANCELLED').required()
    }).required()
}

const fetchIncomingSchema = {
    query: Joi.object({
        page: Joi.number().min(1),
        variantId: UUID,
        variantName: variantSchema.variantBody.name,
        productName: productSchema.productBody.name,
        ...customerDetails,
        notes: Joi.string().max(999)
    })
}

export default {
    createOrder: createOrderSchema,
    update: updateSchema,
    fetchIncoming: fetchIncomingSchema
};