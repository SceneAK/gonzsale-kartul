import {ApplicationError} from '../common/index.js';
import { tokenAuthServices } from '../services/index.js';

const verify = (required = true) => async (req, res, next) => { 
    const { authToken } = req.signedCookies;
    
    try {
        req.decodedAuthToken = await tokenAuthServices.verifyAuthToken(authToken);
    } catch (jwtErr) {
        if(required) throw new ApplicationError("Failed to verify authentication token, Sign-In is Required.", 401);
    }
    next()
}

export default verify;