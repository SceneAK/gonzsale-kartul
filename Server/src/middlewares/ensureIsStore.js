import { ApplicationError } from "../common/index.js";

const ensureIsStore = (paramName = null) => (req, res, next) => {
    const storeIdParam = req.params[paramName];
    if(!req.authJwt?.storeId || (storeIdParam && req.authJwt.storeId != storeIdParam))
    {
        throw new ApplicationError("User cannot access this store's resources", 403);
    }
    next();
}
export default ensureIsStore;