import dns from 'dns';
import { ApplicationError } from '../common/index.js';

export async function hasValidDomain(email) {
    const domain = email.split('@')[1];
    return new Promise( (resolve, reject) => {
        dns.resolveMx(domain, (err, addresses) => {
            resolve(!err && addresses.length !== 0)
        });
    })
}

export const JoiValidateEmailDomain = async (email, helpers) => { 
    if(!(await hasValidDomain(email))) throw new ApplicationError('Invalid Domain', 400)
    return email;
};