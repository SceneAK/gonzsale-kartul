import { ApplicationError } from "../common/index.js";
import userServices from "../services/userServices.js";

const mustBeAdmin = async (req, res, next) => {
    const role = await userServices.fetchUserRole(req.decodedAuthToken.id);
    if(role != userServices.ROLES['Admin']) throw new ApplicationError("Not an Admin!", 402);
    next();
}

export default mustBeAdmin;