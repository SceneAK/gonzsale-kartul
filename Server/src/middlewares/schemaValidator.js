import "joi";

const validatePassReq = (reqSchemaFunc) => async (req, res, next) => { 
    const reqSchm = reqSchemaFunc(req); 
    await validate(reqSchm)(req, res, next); 
}
const validate = (reqSchemas) => async (req, res, next) => {
    for(const key in reqSchemas)
    {
        const value = await reqSchemas[key].validateAsync(req[key]);
        req[key] = value;
    }
    next();
}
export {validate, validatePassReq};