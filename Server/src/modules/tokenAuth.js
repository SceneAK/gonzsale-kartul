import jwt from 'jsonwebtoken';

const signUser = (userId) => {
    return jwt.sign({ id: userId}, process.env.SECRET_KEY, { expiresIn: '1h' });
}

const  getCleanAuthToken = (req) =>
{
    const token = req.headers['authorization'];
    return token.startsWith("Bearer ") ? token.slice(7, token.length) : token; // remove "Bearer ..." 
}
const verifyAuthToken_mid = async (req, res, next) => {
    const cleanToken = getCleanAuthToken(req);
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
    getCleanAuthToken,
    verifyAuthToken,
    verifyAuthToken_mid
};