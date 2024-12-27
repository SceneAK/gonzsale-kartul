import {userStorageServices} from "../services/index.js";

const MAX_SIZE_USER = 300 * 1024 * 1024; // 300mb
async function ensureBelowLimit(req, res, next)
{
    const usedStorage = userStorageServices.getUsedStorage(req.decodedAuthToken);
    if(usedStorage >= MAX_SIZE_USER) {
        res.status(400).send("Used Storage Limit!"); 
        return;
    }else{
        next();
    }
}
export default ensureBelowLimit;