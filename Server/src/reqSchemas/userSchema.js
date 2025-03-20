import Joi from "joi";
import { JoiValidateEmailDomain } from "./domainValidator.js";

const DIGIT_6_MIN = 1000*1000;
const DIGIT_15_MAX = 999999999999999;
const NUMBERS_EN_JP_CN_SpecialChars = new RegExp('^[a-zA-Z0-9!@#$%^&*()_\\-+=\ \[\\] {}|;:\'",.<>?/\\u4e00-\\u9faf\\u3400-\\u4dbf\\u3000-\\u303f\\u3040-\\u309f\\u30a0-\\u30ff\\u31f0-\\u31ff\\u4e00-\\u9faf]{0,}$');
const contacts = {
    name: Joi.string().pattern(NUMBERS_EN_JP_CN_SpecialChars).min(2).max(35),
    phone: Joi.number().integer().min(DIGIT_6_MIN).max(DIGIT_15_MAX),
    email: Joi.string().email().external(JoiValidateEmailDomain).max(320)
}
const contactsAllRequired = {
    name: contacts.name.required(),
    phone: contacts.phone.required(),
    email: contacts.email.required()
}

const signUpSchema = {
    body: Joi.object(contactsAllRequired).append({
        password: Joi.string().pattern(NUMBERS_EN_JP_CN_SpecialChars).min(8).max(127).required(),
    }).required()
}

const signInSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }).required()
}

const editContactsSchema = {
    body: Joi.object(contacts).required()
}

export default {
    signIn: signInSchema,
    signUp: signUpSchema,
    editContacts: editContactsSchema,
    contacts
};