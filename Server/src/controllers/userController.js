import { userServices, tokenAuthServices, storeServices } from '../services/index.js';
import 'cookie-parser';

const fetchUsers = async (req, res) => {
    const {page, ...where} = req.query;
    const users = await userServices.fetchUsers(req.decodedAuthToken.id, page, where);
    return res.json(users);
}

const signIn = async (req, res) => {
    const {email, password} = req.body;
    const user = await userServices.signIn(email, password);
    await setAuthTokenCookie(res, user);
    return res.json(user);
}

const signUp = async (req, res) => {
    const {password, ...contactData} = req.body;
    const user = await userServices.signUp(contactData, password)
    await setAuthTokenCookie(res, user);
    return res.json(user);
}

const editRole = async (req, res) => {
    const {id, role} = req.params;
    await userServices.editRole(id, role, req.decodedAuthToken.id);
    return res.send("Role granted");
}

const editContacts = async (req, res) => {
    await userServices.editContacts(req.body, req.decodedAuthToken.id);
    return res.send("Contacts edited");
}

const refresh = async (req, res) => {
    const user = await userServices.refresh(req.decodedAuthToken);
    await setAuthTokenCookie(res, user);
    res.json(user);
}

const expireCookie = async (req, res) => {
    res.cookie(AUTH_TOKEN_NAME, {
        ...cookieOptions,
        expires: new Date(0)
    })
    res.send("Cookie Set Expired");
}

const AUTH_TOKEN_NAME = 'authToken';
const cookieOptions = {
    httpOnly: true, 
    signed: true,
    secure: false, // enable on production
    sameSite: 'Strict'
}
async function setAuthTokenCookie(res, user)
{
    const payload = await buildPayload(user);
    const authToken = tokenAuthServices.signPayload(payload);
    res.cookie(AUTH_TOKEN_NAME, authToken, cookieOptions);
}
async function buildPayload(user)
{
    const payload = {
        id: user.id,
        role: user.role
    }
    if(user.role == userServices.ROLES['StoreManager'])
    {
        payload.storeId = await storeServices.fetchStoreIdOfUser(user.id);
        console.log(payload);
    }
    return payload;
}

export default {
    fetchUsers,
    signIn,
    signUp,
    editRole,
    editContacts,
    refresh,
    expireCookie
};