const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
let connection;
(async () => { 
    connection = await require("../modules/db")
})()

const authenticate = async (authInfo) => {
    const [rows] = connection.execute('SELECT * FROM user WHERE user_email = ?', [authInfo.email]);
    const result = await bcrypt.compare(authInfo.password, rows[0].user_password);
    if(result) { 
        return jwt.sign(row[0].user_id, process.env.SECRET_KEY, { expiresIn: '1h' }); // token
    }
}

const checkAuthToken_middle = async (req, res, next) => {
    const token = req.headers['authorization'];
    const cleanToken = token.startsWith("Bearer ") ? token.slice(7, token.length) : token; // remove "Bearer ..." 
    try {
        const user_id = checkAuthToken(cleanToken);
        req.authorized_user_id = user_id; // pass in the request
        next()    
    } catch (err) {
        return res.status(401).send("Unauthorized");
    }
    
}
const checkAuthToken = (authToken) => // async
{
    return new Promise( (resolve, reject) =>{
        
        jwt.verify(authToken, process.env.SECRET_KEY, (err, decodedId)=>{
            if(err)
            {
                reject(err);
            } else{
                resolve(decodedId);
            }
        }   
        );

    });
}  


module.exports = {
    authenticate,
    checkAuthToken,
    checkAuthToken_middle
}