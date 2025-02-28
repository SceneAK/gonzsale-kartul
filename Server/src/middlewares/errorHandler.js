import { MulterError } from "multer";
import { ApplicationError } from "../common/index.js"
import { logger } from "../systems/index.js";

export default function errorHandler(err, req, res, next){
    if(err.isJoi)
    {
        return res.status(400).send("Validation Error: " + err.message)
    }
    if(err instanceof ApplicationError)
    {
        return res.status(err.statusCode).send(err.message);
    }
    if(err instanceof MulterError)
    {
        return res.status(400).send(err.message);
    }

    logger.error(err);
    return res.status(500).send(err.message);
}