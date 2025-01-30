import bcrypt from 'bcrypt'; 
import tokenAuthServices from './tokenAuthServices.js';
import databaseInitializePromise from '../database/initialize.js'
import {ApplicationError} from '../common/index.js';
import { UniqueConstraintError } from 'sequelize';
const { User } = await databaseInitializePromise;

const SALT_ROUNDS = 8;

const SERVE_ATTRIBUTES = ['id', 'name', 'phone', 'email', 'role'];

const ROLES = {
    User: 'USER',
    Admin: 'ADMIN',
    StoreManager: 'STORE_MANAGER'
}

async function fetchUser(id)
{
    return (await _fetchUser(id, {attributes: SERVE_ATTRIBUTES})).toJSON();
}
async function _fetchUser(id, options)
{
    const userModel = await User.findByPk(id, options);
    if(!userModel) throw new ApplicationError("User ID not found", 404);
    return userModel;
}

async function signIn(email, password)
{
    const user = await User.findOne({ where: {email}, raw: true});
    if(!user) throw new ApplicationError("Email not found", 404);

    const match = await bcrypt.compare(password, user.password);;
    if(!match) throw new ApplicationError("Failed to Authenticate", 401);
    
    filterOnly(user, SERVE_ATTRIBUTES);
    return signReturnObject(user);
}

async function signUp(email, password, name, phone)
{
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    try
    {
        const userModel = await User.create({
            email,
            name,
            phone,
            password: hashed
        });
        const user = userModel.toJSON();
        filterOnly(user, SERVE_ATTRIBUTES);
        return signReturnObject(user);
    }catch(err)
    {
        if(err instanceof UniqueConstraintError){
            const message = err.errors[0]?.message;
            throw new ApplicationError(message, 400)
        }
        throw err;
    }
}
function filterOnly(obj, keys)
{
    for (const key in obj) {
        if(!keys.includes(key))
        {
            delete obj[key];
        }
    }
}

async function findOrCreateGuest(email, name, phone)
{
    const [user] = await User.findOrCreate({
        where: {email}, 
        defaults: { name, phone, email, password: null },
        raw: true
    })
    delete user.password, user.updatedAt;
    return signReturnObject(user);
}
async function isGuest(userId)
{
    const user = await _fetchUser(userId, {attributes: ['password']});
    return user.password == null;
}

async function refresh(decodedAuthToken)
{
    return createAuthToken(decodedAuthToken);
}

async function editRole(id, role, requesterId)
{
    const requesterRole = await fetchUserRole(requesterId);
    if(requesterRole != ROLES.Admin) throw new ApplicationError("Unauthorized", 401);
    
    if(await isGuest(id)) throw new ApplicationError("Cannot edit role of guest", 400);
    
    await User.update({role}, {where: {id}});
}

async function fetchUserRole(userId)
{
    const userModel = await _fetchUser(userId, {attributes: ['role']});
    return userModel.role;
}

async function signReturnObject(user)
{
    const authToken = await createAuthToken(user);
    return {user, authToken};
}
async function createAuthToken(user)
{
    return tokenAuthServices.signPayload({
        id: user.id,
        role: user.role
    })
}

function include(level)
{
    switch (level) {
        case 'serve':
            return {
                model: User,
                attributes: SERVE_ATTRIBUTES
            }
        case 'contacts':
            return {
                model: User,
                attributes: ['name', 'phone', 'email']
            }
        default:
            return {
                model: User
            } 
    }
}

export default {
    ROLES,
    fetchUser,
    fetchUserRole,
    signIn,
    signUp,
    findOrCreateGuest,
    editRole,
    refresh,
    include
};