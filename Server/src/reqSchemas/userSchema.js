import Joi from "joi";
const signInSchema = {
    body: Joi.object({
    user_email: Joi.string().email().required(),
    user_password: Joi.string().required()
    }).required()
}

const NUMBERS_EN_JP_CN_SpecialChars = new RegExp('^[a-zA-Z0-9!@#$%^&*()_\\-+=\ \[\\] {}|;:\'",.<>?/\\u4e00-\\u9faf\\u3400-\\u4dbf\\u3000-\\u303f\\u3040-\\u309f\\u30a0-\\u30ff\\u31f0-\\u31ff\\u4e00-\\u9faf]{0,}$');

const signUpSchema = {
    body:Joi.object({
    user_email: Joi.string().email().required(),
    user_password: Joi.string().pattern(NUMBERS_EN_JP_CN_SpecialChars).min(8).max(127).required(),
    user_name: Joi.string().pattern(NUMBERS_EN_JP_CN_SpecialChars).default('unknown'),
    user_phone: Joi.number().min(6).max(15)
    }).required()
}

export default {
    signIn: signInSchema,
    singUp: signUpSchema
};