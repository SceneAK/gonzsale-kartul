import {ApplicationError} from '../common/index.js';
import { tokenAuthServices} from '../services/index.js';

const populateAuthJwt = (options) => async (req, res, next) => { 
    const { authJwt } = req.signedCookies;
    
    try {
        req.authJwt = await tokenAuthServices.verifyAuthToken(authJwt);
    } catch (JsonWebTokenError) {
        if(options?.required) throw new ApplicationError("Failed to verify authentication token, Sign-In is Required.", 401);
    }
    next()
}
export default populateAuthJwt;