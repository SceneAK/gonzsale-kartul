import bcrypt from 'bcrypt'; 
import tokenAuthServices from './tokenAuthServices.js';
import databaseInitializePromise from '../database/initialize.js'
import { ApplicationError, paginationOption, reformatFindCountAll } from '../common/index.js';
import { col, UniqueConstraintError, where } from 'sequelize';
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

async function fetchUsers(requesterId, page = 1, where = {})
{
    await ensureAdmin(requesterId);
    const result = await User.findAndCountAll( {
        attributes: SERVE_ATTRIBUTES,
        ...paginationOption(page), 
        where
    });
    return reformatFindCountAll(result, page);
}

async function signIn(email, password)
{
    const user = await User.findOne({ where: where(col('email'), '=', email), raw: true }); // Refer to backend_doc
    if(!user) throw new ApplicationError("Email not found", 404);

    const match = await bcrypt.compare(password, user.password);;
    if(!match) throw new ApplicationError("Failed to Authenticate", 401);
    
    filterOnly(user, SERVE_ATTRIBUTES);
    return user;
}

async function signUp(contactData, password)
{
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    try
    {
        const userModel = await User.create({...contactData, password: hashed});
        const user = userModel.toJSON();
        filterOnly(user, SERVE_ATTRIBUTES);
        return user;
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

async function editContacts(contactData, id)
{
    return await User.update(contactData, {where: { id } } );;
}

async function editRole(id, role, requesterId)
{
    await ensureAdmin(requesterId);
    await User.update({role}, {where: {id}});
}

async function ensureAdmin(requesterId)
{
    const requesterRole = await fetchUserRole(requesterId);
    if(requesterRole != ROLES.Admin) throw new ApplicationError("Unauthorized", 401);
}
async function fetchUserRole(userId)
{
    const userModel = await _fetchUser(userId, {attributes: ['role']});
    return userModel.role;
}

async function refresh(decodedAuthToken)
{
    return await fetchUser(decodedAuthToken.id);
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
    fetchUsers,
    fetchUserRole,
    signIn,
    signUp,
    editRole,
    editContacts,
    refresh,
    include
};