import { ApplicationError } from "../common/index.js";
import userServices from "../services/userServices.js";

const ensureAdminOr = (ensureMiddleware) => async (req, res, next) => {
    const isAdmin = await isAdminReq(req);
    if(isAdmin){
        next()
    }else{
        ensureMiddleware(req, res, next);
    }
}
const ensureAdmin = async (req, res, next) => {
    const isAdmin = await isAdminReq(req);
    if(!isAdmin) throw new ApplicationError("Not an Admin!", 402); 
    next();
}
async function isAdminReq(req){
    const role = await userServices.fetchUserRole(req?.authJwt?.id);
    return role == userServices.ROLES.Admin;
}
export { ensureAdmin, ensureAdminOr };