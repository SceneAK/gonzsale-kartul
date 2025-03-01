import { tokenAuthServices, userServices, storeServices } from "../services/index.js";

export async function setAuthTokenCookie(res, user)
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
        try
        {
            payload.storeId = await storeServices.fetchStoreIdOfUser(user.id);
        }catch(err){}
    }
    return payload;
}
export async function expireAuthCookie(res)
{
    res.cookie(AUTH_TOKEN_NAME, {
        ...cookieOptions,
        expires: new Date(0)
    })
}

const AUTH_TOKEN_NAME = 'authToken';
const cookieOptions = {
    httpOnly: true, 
    signed: true,
    secure: false, // enable on production
    sameSite: 'Strict'
}