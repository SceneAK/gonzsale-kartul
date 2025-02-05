import Joi from "joi";
const pageQuerySchema = {
    query: Joi.object({
        page: Joi.number().min(1)
    })
}
export default pageQuerySchema;