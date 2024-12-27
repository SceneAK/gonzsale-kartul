import bcrypt from 'bcrypt'; 
import tokenAuthServices from './tokenAuthServices.js';
import databaseInitializePromise from '../database/initialize.js'
const { User } = await databaseInitializePromise;

const SALT_ROUNDS = 8;

async function fetchUserInfo(id)
{
    const userModel = await User.findByPk(id);
    if(!userModel) throw new Error("User not found");
    
    return prepareForServe(userModel);
}

async function signIn(email, password)
{
    const userModel = await authenticate(email, password);
    if(!userModel) throw new Error("Failed to Authenticate");
    
    return signInReturnObject(userModel);
}

async function signUp(email, password, name, phone)
{
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const [userModel] = await User.findOrCreate({where: {email}, defaults:{
        name,
        phone,
        password: hashed
    }})
    
    return signInReturnObject(userModel);
}

async function findOrCreateGuest(email, name, phone)
{
    const [userModel] = await User.findOrCreate({where: {email}, defaults: {
        name,
        phone,
        email,
        password: null
    }})
    
    return signInReturnObject(userModel);
}

async function refresh(decodedAuthToken)
{
    return createAuthToken(decodedAuthToken);
}

async function authenticate(email, password)
{
    const userModel = await User.findOne({where: {email}});
    
    const result = await bcrypt.compare(password, userModel.password);
    return result ? userModel : null;
}

async function signInReturnObject(userModel)
{
    const user = prepareForServe(userModel);
    const authToken = createAuthToken(user);
    return {user, authToken};
}
async function createAuthToken(user)
{
    return tokenAuthServices.signPayload({
        id: user.id,
        role: user.role
    })
}
async function prepareForServe(userModel)
{
    const user = userModel.get();
    delete user.password;
    return user;
}

export default {
    fetchUserInfo,
    signIn,
    signUp,
    findOrCreateGuest,
    refresh
};