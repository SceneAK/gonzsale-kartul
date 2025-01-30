import Joi from "joi";
export const UUID = Joi.string().guid({version: 'uuidv4'});