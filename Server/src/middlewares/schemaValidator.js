import "joi";

const validate = (reqSchemas) => (req, res, next) => {
    for(const key in reqSchemas)
    {
        const {error, value} = reqSchemas[key].validate(req[key], {convert: true});
        if(error) throw error;
        req[key] = value;
    }
    next();
}

export default validate;