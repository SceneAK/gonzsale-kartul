import {ApplicationError} from "../common/index.js";
import { userStorageServices } from "../services/index.js";

const MAX_SIZE_USER = 300 * 1024 * 1024; // 300mb 
async function ensureBelowLimit(req, res, next)
{
    const usedStorage = await userStorageServices.getUsed(req.authJwt.id);
    if(usedStorage >= MAX_SIZE_USER) {
        throw new ApplicationError("Used Storage Limit!", 409);
    }else{
        next();
    }
}
export default ensureBelowLimit;