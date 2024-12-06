import bcrypt from 'bcrypt'; 
import { signUser } from '../modules/tokenAuth.js';
import connectionPromise from '../modules/db.js'
const connection = await connectionPromise;

const SALT_ROUNDS = 8;

const getUser = async (req, res) => {
    const {id} = req.params;
    const [rows] = await connection.execute('SELECT * FROM user WHERE user_id = ?', [id]);
    res.json(rows);
}

async function authenticate(email, password){ // authentication happens only in sign-in
    const [rows] = await connection.execute('SELECT user_id, user_role, user_password FROM user WHERE user_email = ?', [email]);
    if(rows.length == 0) return null;

    const result = bcrypt.compare(password, rows[0].user_password)
    if(result){
        return rows[0];
    }
    return null;
}

const signIn = async (req, res) => {
    const {user_email, user_password} = req.body;
    const user = await authenticate(user_email, user_password);
    if(user != null)
    {
        const authToken = signUser(user.user_id, user.user_role);
        res.cookie('token', authToken, { signed: true });
        res.send('Signed In');
    }else{
        return res.status(401).send("Invalid Sign In Data");
    }
}


const signUp = async (req, res) => {
    const {user_password, user_name, user_phone, user_email} = req.body;

    const hashed = await bcrypt.hash(user_password, SALT_ROUNDS);

    const [result] = await connection.execute("INSERT INTO user (user_name, user_phone, user_email, user_password) VALUES (?, ?, ?, ?)", 
        [
            user_name,
            user_phone,
            user_email,
            hashed
        ]
    )
    if(result)
    {
        const authToken = signUser(result.insertId, 'USER'); // default role
        res.cookie('token', authToken, { signed: true });
        res.send('Signed Up');
    }else{
        res.status(500).send("There was an unkonwn error");
    }
    
}

export default {
    getUser,
    signIn,
    signUp
};

// TODO: Get User, Update Password, Password Forgot