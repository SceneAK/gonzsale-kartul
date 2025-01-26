import { ApplicationError, logger } from "../common/index.js"

export default function errorHandler(err, req, res, next){
    if(err.isJoi)
    {
        console.log(req.body);
        return res.status(400).send("Validation Error: " + err.message)
    }
    if(err instanceof ApplicationError)
    {
        return res.status(err.statusCode).send(err.message);
    }

    logger.error(err);
    return res.status(500).send(err.message);
}