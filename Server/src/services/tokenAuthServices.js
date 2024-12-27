import jwt from 'jsonwebtoken'; 
import '../../initialize.js'; // ensure process.env is up

function signPayload(payload)
{
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
}

async function verifyAuthToken(authToken)
{
    return new Promise( (resolve, reject) => {
        jwt.verify(authToken, process.env.SECRET_KEY, (err, decoded)=>{
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