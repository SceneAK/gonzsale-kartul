import { user } from "./fetches.js";

const REFRESH_INTERVAL_MS = 1000 * 60 * 30; // 30 menit

function updateCachedLoginDetail(value){
    cachedLoginDetail = value;
}

const str = localStorage.getItem('loginDetail')
let cachedLoginDetail = str ? JSON.parse(str) : null;
export function getCachedLogin() { return cachedLoginDetail }

const autoRefresher = async () => {
    try
    {
        const userInfo = await user.refresh();
        setLoginDetail(userInfo);
        setTimeout(autoRefresher, REFRESH_INTERVAL_MS);
    }catch(err)
    {
        localStorage.removeItem('loginDetail');
        window.location.reload();
    }
    
}
if(cachedLoginDetail)
{
    const delta = (Date.now() - cachedLoginDetail.lastRefreshed);
    const timeout = Math.max(REFRESH_INTERVAL_MS - delta, 10);

    setTimeout(autoRefresher, timeout)
}

function setLoginDetail(loginDetail)
{
    loginDetail.lastRefreshed = Date.now();
    localStorage.setItem('loginDetail', JSON.stringify(loginDetail));
    updateCachedLoginDetail(loginDetail);
}

export async function refreshAndUpdate()
{
    const userInfo = await user.refresh();
    setLoginDetail(userInfo);
    window.location.reload();
}

export function hookSignIn(signInButton, emailInput, passwordInput)
{
    signInButton.addEventListener('click', async function(event){
        const userInfo = await user.signIn(emailInput.value, passwordInput.value);
        setLoginDetail(userInfo);
        window.location.reload();
    });

}

export async function signUp(nameInput, phoneInput, emailInput, passwordInput, recaptchaResponse)
{
    const userInfo = await user.signUp(nameInput.value, phoneInput.value, emailInput.value, passwordInput.value, recaptchaResponse);
    setLoginDetail(userInfo);
    window.location.href = '/';
}

export function hookSignOut(signOutButton)
{
    signOutButton.addEventListener('click', async function(event){
        await user.expireCookie();
        localStorage.clear();
    });
}