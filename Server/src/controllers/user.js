const {signUser} = require('../modules/tokenAuth');
const bcrypt = require('bcrypt'); const SALT_ROUNDS = 8;
const dns = require('dns');
let connection;
(async () => { 
    connection = await require("../modules/db")
})()

const getUser = async (req, res) => {
    const {id} = req.params;
    const [rows] = await connection.execute('SELECT * FROM user WHERE user_id = ?', [id]);
    res.json(rows[0]);
}

const signIn = async (req, res) => {
    const authenticate = async (email, password) => { // authentication happens only in sign-in
        const [rows] = await connection.execute('SELECT * FROM user WHERE user_email = ?', [email]);
        const result = bcrypt.compare(password, rows[0].user_password)
        if(result){
            return rows[0].user_id;
        }
        return null;
    }
    const user_id = await authenticate(req.body.user_email, req.body.user_password);
    if(user_id != null)
    {
        const authToken = signUser(user_id);
        res.json({ authToken }); // API calls that require authentication would use the one during sign-in
    }else{
        return res.status(401).send("Invalid Credentials");
    }
}


function isValidName(name) { return !name.includes(' '); } // Anything more?
function isValidEmail(email) { 
    // Test format. Got the regex from copilot
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) { return false;}
    
    const validDomain = await (() => {
        const domain = email.split('@')[1];
        return new Promise((resolve) =>{
            dns.resolveMx(domain, (err, addresses) => {
                resolve(err || addresses.length === 0)
            })
        });
    })()
    if(!validDomain) { return false; }

    return true;
}
const signUp = async (req, res) => {
    if(!isValidName(req.body.user_name))
    {
        return res.status(400).send("Invalid Username");
    }
    if(!isValidEmail(req.body.user_name))
    {
        return res.status(400).send("Invalid Email");
    }

    const hashed = await bcrypt.hash(req.body.user_password, SALT_ROUNDS);

    const [result] = await connection.execute("INSERT INTO user (user_name, user_phone, user_email, user_password) VALUES (?, ?, ?, ?)", 
        [
            req.body.user_name,
            req.body.user_phone,
            req.body.user_email,
            hashed
        ]
    )
    if(result)
    {
        const authToken = signUser(result.insertedId);
        console.log(`Inserted ${result.insertedId} into user`);
        res.json({ authToken });
    }else{
        res.status(500).send("There was an unkonwn error");
    }
    
}

module.exports = {
    getUser,
    signIn,
    signUp
}

// TODO: Get User, Update Password, Password Forgot