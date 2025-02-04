import "joi";

const validatePassReq = (reqSchemaFunc) => (req, res, next) => { const reqSchm = reqSchemaFunc(req); validate(reqSchm)(req, res, next); }
const validate = (reqSchemas) => (req, res, next) => {
    for(const key in reqSchemas)
    {
        const {error, value} = reqSchemas[key].validate(req[key]);
        if(error) throw error;
        req[key] = value;
    }
    next();
}

export {validate, validatePassReq};