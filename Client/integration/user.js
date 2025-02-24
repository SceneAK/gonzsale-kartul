import { user } from "./fetches.js";

const REFRESH_INTERVAL_MS = 1000 * 60 * 30; // 30 menit
const loginDetailStr = localStorage.getItem('loginDetail')
const loginDetail = loginDetailStr ? JSON.parse(loginDetailStr) : null;

const autoRefresher = async () => {
    try
    {
        const userInfo = await user.refresh();
        setLoginInfo(userInfo);
        setTimeout(autoRefresher, REFRESH_INTERVAL_MS);
    }catch(err)
    {
        localStorage.removeItem('loginDetail');
        window.location.reload();
    }
    
}
if(loginDetail)
{
    const delta = (Date.now() - loginDetail.lastRefreshed);
    const timeout = Math.max(REFRESH_INTERVAL_MS - delta, 10);

    setTimeout(autoRefresher, timeout)
}

function setLoginInfo(userInfo)
{
    userInfo.lastRefreshed = Date.now();
    localStorage.setItem('loginDetail', JSON.stringify(userInfo));
}

export async function refreshAndUpdate()
{
    const userInfo = await user.refresh();
    setLoginInfo(userInfo);
    window.location.reload();
}

export function hookSignIn(signInButton, emailInput, passwordInput)
{
    signInButton.addEventListener('click', async function(event){
        const userInfo = await user.signIn(emailInput.value, passwordInput.value);
        setLoginInfo(userInfo);
        window.location.reload();
    });

}

export async function signUp(nameInput, phoneInput, emailInput, passwordInput, recaptchaResponse)
{
    const userInfo = await user.signUp(nameInput.value, phoneInput.value, emailInput.value, passwordInput.value, recaptchaResponse);
    setLoginInfo(userInfo);
    window.location.href = '/';
}

export function hookSignOut(signOutButton)
{
    signOutButton.addEventListener('click', async function(event){
        await user.expireCookie();
        localStorage.clear();
    });
}