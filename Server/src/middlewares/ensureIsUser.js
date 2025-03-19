import { ApplicationError } from "../common/index.js";

const ensureIsUser = (paramName = null) => async (req, res, next) => {
    const userIdParam = req.params[paramName];
    if(!req.authJwt?.id || (userIdParam && req.authJwt?.id != userIdParam))
    {
        throw new ApplicationError("Current user cannot access requested User", 403);
    }
    next();
}
export default ensureIsUser;