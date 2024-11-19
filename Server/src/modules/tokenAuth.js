import jwt from 'jsonwebtoken';

const signUser = (userId) => {
    return jwt.sign({ id: userId}, process.env.SECRET_KEY, { expiresIn: '1h' });
}

const verifyAuthToken_mid = async (req, res, next) => {
    const token = req.headers['authorization'];
    const cleanToken = token.startsWith("Bearer ") ? token.slice(7, token.length) : token; // remove "Bearer ..." 
    try {
        const {id} = await verifyAuthToken(cleanToken);
        req.authenticatedUserId = id; // pass in the request
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
    verifyAuthToken_mid
};