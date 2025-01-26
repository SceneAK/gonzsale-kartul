import { userServices } from '../services/index.js';
import 'cookie-parser';

const signIn = async (req, res) => {
    const {email, password} = req.body;
    const {user, authToken} = await userServices.signIn(email, password);
    setAuthTokenCookie(res, authToken);
    return res.json(user);
}

const signUp = async (req, res) => {
    const {email, password, name, phone} = req.body;
    const {user, authToken} = await userServices.signUp(email, password, name, phone)
    setAuthTokenCookie(res, authToken);
    return res.json(user);
}

const refresh = async (req, res) => {
    const newToken = await userServices.refresh(req.decodedAuthToken);
    setAuthTokenCookie(res, newToken);
    res.send("Refreshed token");
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