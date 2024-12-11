import { v4 } from 'uuid';
import bcrypt from 'bcrypt'; 
import { signUser } from '../modules/tokenAuth.js';
import connectionPromise from '../modules/db.js'
const connection = await connectionPromise;

const SALT_ROUNDS = 8;

async function authenticate(email, password){ // authentication happens only in sign-in
    const [rows] = await connection.execute('SELECT * FROM users WHERE user_email = ?', [email]);
    if(rows.length == 0) return null;

    const result = bcrypt.compare(password, rows[0].user_password)
    if(result){
        delete rows[0].user_password;
        delete rows[0].user_used_storage;
        return rows[0];
    }
    return null;
}
const cookieOptions = {
    httpOnly: true, 
    signed: true,
    //secure: true, // enable on production
    sameSite: 'strict'
}

const signIn = async (req, res) => {
    const {user_email, user_password} = req.body;
    const user = await authenticate(user_email, user_password);
    if(user != null)
    {
        const authToken = signUser(user.user_id, user.user_role);
        res.cookie('token', authToken, cookieOptions);
        res.json(user);
    }else{
        return res.status(401).send("Invalid Sign In Data");
    }
}


const signUp = async (req, res) => {
    const {user_password, user_name, user_phone, user_email} = req.body;

    const hashed = await bcrypt.hash(user_password, SALT_ROUNDS);

    try {
        const [rows] = await connection.execute("SELECT user_id FROM users WHERE user_email = ?", [user_email])
        let user_id;
        if(rows.length != 0){
            user_id = rows[0].user_id;
            await connection.execute("UPDATE users SET user_name = ?, user_phone = ?, user_password = ? WHERE user_id = ?", [
                user_name,
                user_phone,
                user_password,
                user_id
            ])
        }else{
            user_id = v4();
            await connection.execute("INSERT INTO users (user_id, user_name, user_phone, user_email, user_password) VALUES (?, ?, ?, ?, ?)", [
                user_id,
                user_name,
                user_phone,
                user_email,
                hashed
            ]);
        }
        
        const authToken = signUser(user_id, 'USER'); // default role
        res.cookie('token', authToken, cookieOptions);
        res.json({user_name, user_phone, user_email, user_role: "USER"});
    } catch (error) {
        console.log("ERROR ", error);
        return res.status(500).send("ERR\n" + error);
    }
}

export default {
    signIn,
    signUp
};

// TODO: Get User, Update Password, Password Forgot