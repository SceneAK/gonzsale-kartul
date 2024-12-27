import { userServices } from '../services/index.js';
import { logger } from '../common/logger.js';
import 'cookie-parser';

const signIn = async (req, res) => {
    const {email, password} = req.body;
    try
    {
        const {user, authToken} = await userServices.signIn(email, password);
        setAuthTokenCookie(res, authToken);
        return res.json(user);
    }catch(err)
    {
        return res.status(401).send(err.message);
    }
}

const signUp = async (req, res) => {
    const {email, password, name, phone} = req.body;
    
    try 
    {
        const {user, authToken} = userServices.signUp(email, password, name, phone)
        setAuthTokenCookie(res, authToken);
        return res.json(user);
    }catch (err) 
    {
        logger.error("Sign Up Error ", err);
        return res.status(500).send(err.message);
    }
}

const refresh = async (req, res) => {
    try
    {
        const newToken = userServices.refresh(req.decodedAuthToken);
        setAuthTokenCookie(res, newToken);
        res.send("Refreshed token");
    }catch(err)
    {
        return res.status(401).send(err.message);
    }
}

const AUTH_TOKEN_NAME = 'authToken';
const cookieOptions = {
    httpOnly: true, 
    signed: true,
    secure: false, // enable on production
    sameSite: 'Strict'
}
function setAuthTokenCookie(res, authToken)
{
    res.cookie(AUTH_TOKEN_NAME, authToken, cookieOptions);
}

export default {
    signIn,
    signUp,
    refresh
};