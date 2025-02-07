import { user } from "./fetches.js";

const REFRESH_INTERVAL_MS = 1000 * 60 * 40; // 40 menit
let refresherId;
const autoRefresher = () => {
    if(localStorage.getItem('loginDetail'))
    {
        user.refresh().catch( () => {
            clearInterval(refresherId);
            localStorage.clear();
            window.location.reload();
        })
    }
}

function updateUserInfo(userInfo)
{
    localStorage.setItem('loginDetail', JSON.stringify(userInfo));
    clearInterval(refresherId);
    refresherId = setInterval(autoRefresher, REFRESH_INTERVAL_MS);
    window.location.reload();
}

export async function refreshAndUpdate()
{
    const userInfo = await user.refresh();
    updateUserInfo(userInfo);
}

export function hookSignIn(signInButton, emailInput, passwordInput)
{
    signInButton.addEventListener('click', async function(event){
        const userInfo = await user.signIn(emailInput.value, passwordInput.value);
        updateUserInfo(userInfo);
    });

}

export function hookSignUp(signUpButton, nameInput, phoneInput, emailInput, passwordInput)
{
    signUpButton.addEventListener('click', async function(event){
        const userInfo = await user.signUp(nameInput.value, phoneInput.value, emailInput.value, passwordInput.value);
        updateUserInfo(userInfo);
    });
}

export function hookSignOut(signOutButton)
{
    signOutButton.addEventListener('click', async function(event){
        await user.expireCookie();
        localStorage.clear();
    });
}