import "joi";

const validate = (reqSchemas) => (req, res, next) => {
    for(const key in reqSchemas)
    {
        const {error, value} = reqSchemas[key].validate(req[key], {convert: true});
        if(error) return res.status(400).send("ERR: " + error);
        req[key] = value;
    }
    next();
}

// const createJsonParserValidator = (parsedObjSchema = undefined) => (value, helper)=>{
//     try
//     {
//         let obj = JSON.parse(value);

//         if(parsedObjSchema != undefined){
//             const {error, value} = parsedObjSchema.validate(obj);
//             if(error) throw new Error(error.message);
//             obj = value;
//         }
//         return {raw: value, parsedBySchema: obj};
//     }catch(err){
//         return helper.error('any.invalid', {message: err.message});
//     }
// }

export default validate;