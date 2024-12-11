import { user } from "./fetches.js";

function trackSignin(userInfo)
{
    localStorage.setItem('loginDetail', {
        ...userInfo,
        time: Date.now()
    });
}

export function hookSignIn(signInButton, emailInput, passwordInput)
{
    signInButton.addEventListener('click', async function(event){
        const userInfo = await user.signIn(emailInput.value, passwordInput.value);
        trackSignin(userInfo);
        window.location.reload();
    });

}

export function hookSignUp(signUpButton, nameInput, phoneInput, emailInput, passwordInput)
{
    signUpButton.addEventListener('click', async function(event){
        const userInfo = await user.signUp(nameInput.value, phoneInput.value, emailInput.value, passwordInput.value);
        trackSignin(userInfo);
    });
}