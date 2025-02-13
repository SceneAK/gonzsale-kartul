import { ApplicationError } from "../common/index.js";

const ensureStore = async (req, res, next) => {
    if(!req.decodedAuthToken?.storeId)
    {
        throw new ApplicationError("Request requires an owned store", 401);
    }
    next();
}
export default ensureStore;