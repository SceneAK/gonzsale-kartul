import { storeServices, userServices } from '../services/index.js';
import { setAuthTokenCookie, expireAuthCookie } from './cookieSetter.js';
import 'cookie-parser';

const fetchUsers = async (req, res) => {
    const {page, ...where} = req.query;
    const users = await userServices.fetchUsers(req.authJwt.id, page, where);
    return res.json(users);
}

const signIn = async (req, res) => {
    const {email, password} = req.body;
    const user = await userServices.signIn(email, password);
    const enrichedUser = await enrichUser(user);

    await setAuthTokenCookie(res, enrichedUser);
    return res.json(enrichedUser);
}

const signUp = async (req, res) => {
    const {password, ...contactData} = req.body;
    const user = await userServices.signUp(contactData, password)
    const enrichedUser = await enrichUser(user);

    await setAuthTokenCookie(res, enrichedUser);
    return res.json(enrichedUser);
}

const editRole = async (req, res) => {
    const {id, role} = req.params;
    await userServices.editRole(id, role, req.authJwt.id);
    return res.send("Role granted");
}

const editContacts = async (req, res) => {
    await userServices.editContacts(req.body, req.authJwt.id);
    return res.send("Contacts edited");
}

const refresh = async (req, res) => {
    const user = await userServices.refresh(req.authJwt);
    const enrichedUser = await enrichUser(user);
    await setAuthTokenCookie(res, enrichedUser);
    return res.json(enrichedUser);
}

const expireCookie = async (req, res) => {
    await expireAuthCookie(res);
    res.send("Cookie Set Expired");
}

async function enrichUser(user){
    if(user.role == userServices.ROLES.StoreManager)
    {
        try
        {
            user.storeId = await storeServices.fetchStoreIdOfUser(user.id);
        }catch(err){}
    }
    return user;
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