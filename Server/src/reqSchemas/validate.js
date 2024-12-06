import Joi from "joi";
const validate = (reqSchemas) => (req, res, next) => {
    for(const key in reqSchemas)
    {
        const {error, value} = reqSchemas[key].validate(req[key]);
        if(error) return res.status(400).send(error.message);
        req[key] = value;
    }
    next();
}

export default validate;