import { tokenAuthServices } from '../services/index.js';

const verify = async (req, res, next) => { 
    const {authToken} = req.signedCookies;
    try {
        req.decodedAuthToken = await tokenAuthServices.verifyAuthToken(authToken);
        next()
    } catch (err) {
        return res.status(401).send("Unauthorized: " + err);
    }
}

export default verify;