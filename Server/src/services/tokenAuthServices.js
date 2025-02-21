import jwt from 'jsonwebtoken'; 
import { env } from '../../initialize.js';

function signPayload(payload)
{
    return jwt.sign(payload, env.SECRET_KEY, { expiresIn: '1h' });
}

async function verifyAuthToken(authToken)
{
    return new Promise( (resolve, reject) => {
        jwt.verify(authToken, env.SECRET_KEY, (err, decoded)=>{
            if(err)
            {
                reject(err);
            } else{
                resolve(decoded);
            }
        }   
        );
    });
}  


export default {
    signPayload,
    verifyAuthToken
};