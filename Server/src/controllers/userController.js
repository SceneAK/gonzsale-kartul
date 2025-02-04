import { userServices } from '../services/index.js';
import 'cookie-parser';

const fetchUsers = async (req, res) => {
    const {page, ...where} = req.query;
    const users = await userServices.fetchUsers(req.decodedAuthToken.id, page, where);
    return res.json(users);
}

const signIn = async (req, res) => {
    const {email, password} = req.body;
    const {user, authToken} = await userServices.signIn(email, password);
    setAuthTokenCookie(res, authToken);
    return res.json(user);
}

const signUp = async (req, res) => {
    const {password, ...contactData} = req.body;
    const {user, authToken} = await userServices.signUp(contactData, password)
    setAuthTokenCookie(res, authToken);
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
    const newToken = await userServices.refresh(req.decodedAuthToken);
    setAuthTokenCookie(res, newToken);
    res.send("Refreshed token");
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
function setAuthTokenCookie(res, authToken)
{
    res.cookie(AUTH_TOKEN_NAME, authToken, cookieOptions);
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