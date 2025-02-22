import { env } from "../../initialize.js";
import axios from "axios";
import qs from "qs";
import { ApplicationError } from "../common/index.js";

const responseKey = 'g-recaptcha-response';
const urlEncodedHeader = { 'Content-Type': 'application/x-www-form-urlencoded' };
const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
const verifyReCAPTCHA = (req, res, next) => {
    if(env.ENABLE_CAPTCHA == 'true'){
        const captchaResponse = req.body[responseKey];
        if(!captchaResponse) throw new ApplicationError('Please submit reCAPTCHA', 401);
        
        const data = {
            secret: env.RECAPTCHA_V2_SECRET,
            response: captchaResponse
        }
        const result = axios.post(verifyUrl, qs.stringify(data), {headers: urlEncodedHeader })

        if(!result?.data?.success) throw new ApplicationError('reCAPTCHA verification failed', 400);
    }
    delete req.body[responseKey];
    next()
}

export default verifyReCAPTCHA;