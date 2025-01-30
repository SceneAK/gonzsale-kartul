import Joi from "joi";

const signInSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }).required()
}

const DIGIT_6_MIN = 1000*1000;
const DIGIT_15_MAX = 999999999999999;
const NUMBERS_EN_JP_CN_SpecialChars = new RegExp('^[a-zA-Z0-9!@#$%^&*()_\\-+=\ \[\\] {}|;:\'",.<>?/\\u4e00-\\u9faf\\u3400-\\u4dbf\\u3000-\\u303f\\u3040-\\u309f\\u30a0-\\u30ff\\u31f0-\\u31ff\\u4e00-\\u9faf]{0,}$');
const contacts = Joi.object({
    name: Joi.string().pattern(NUMBERS_EN_JP_CN_SpecialChars).required(),
    phone: Joi.number().integer().min(DIGIT_6_MIN).max(DIGIT_15_MAX).required(),
    email: Joi.string().email().required()
});

const signUpSchema = {
    body: contacts.append({
        password: Joi.string().pattern(NUMBERS_EN_JP_CN_SpecialChars).min(8).max(127).required(),
    }).required()
}

const guestSchema = {
    body: contacts.required()
}

export default {
    signIn: signInSchema,
    singUp: signUpSchema,
    guest: guestSchema
};