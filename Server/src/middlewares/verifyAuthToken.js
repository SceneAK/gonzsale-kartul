import {ApplicationError} from '../common/index.js';
import { tokenAuthServices } from '../services/index.js';

const verify = async (req, res, next) => { 
    const { authToken } = req.signedCookies;
    
    try {
        req.decodedAuthToken = await tokenAuthServices.verifyAuthToken(authToken);
        next()
    } catch (jwtErr) {
        throw new ApplicationError("Failed to verify authentication token", 401);
    }
}

export default verify;