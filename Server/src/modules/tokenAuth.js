import jwt from 'jsonwebtoken';

const signUser = (user_id, user_role) => {
    return jwt.sign({id: user_id, role: user_role}, process.env.SECRET_KEY, { expiresIn: '1h' });
}

const verifyUser = async (req, res, next) => { // NOTE: Expects tokens in req.signedCookies after user.js is called
    const {token} = req.signedCookies;
    try {
        req.authUser = await verifyAuthToken(token);
        next()
    } catch (err) {
        return res.status(401).send("Unauthorized");
    }
    
}
const verifyAuthToken = (authToken) => // async
{
    return new Promise( (resolve, reject) =>{
        
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


export {
    signUser,
    verifyAuthToken,
    verifyUser
};