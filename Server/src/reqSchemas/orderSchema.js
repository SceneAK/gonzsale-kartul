import Joi from "joi";
import orderItemSchema from "./orderItemSchema.js";
import userSchema from "./userSchema.js";
import { UUID } from "./common.js";
import page from "./pageSchema.js";

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
        status: Joi.string().valid('UNCOMPLETED', 'READY', 'COMPLETED', 'CANCELED').required()
    }).required()
}

const fetchIncomingSchema = {
    query: page.query.append({
        productId: UUID,
        notes: Joi.string()

    })
}

export default {
    createOrder: createOrderSchema,
    update: updateSchema,
    fetchIncoming: fetchIncomingSchema
};