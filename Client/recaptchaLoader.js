import config from './_config.js';

if(!document.getElementById('recaptcha-container')) throw new Error('No element of id recaptcha-container');
function loadRecaptcha() {
    if(config.ENABLE_CAPTCHA)
    {
        const script = document.createElement('script');
        script.src = "https://www.google.com/recaptcha/api.js?onload=renderCaptcha&render=explicit";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    }
}
loadRecaptcha();

window.renderCaptcha = function(){
    grecaptcha.render('recaptcha-container', {
        sitekey: config.RECAPTCHA_V2_SITE_KEY,
        callback: recaptchaCallback
    });
}

let response;
function recaptchaCallback(token)
{
    response = token;
}
function getRecaptchaResponse(){
    if(!response) throw new Error('No Captcha Response');
    return response;
}

export default getRecaptchaResponse;