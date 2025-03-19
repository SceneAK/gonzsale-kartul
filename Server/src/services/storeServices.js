import imageServices from './imageServices.js';
import userServices from './userServices.js';
import dbInitPromise from '../database/initialize.js'
import {ApplicationError, reformatFindCountAll} from '../common/index.js';
import { paginationOption } from '../common/index.js';
const { Store } = await dbInitPromise;

async function fetchStore(id)
{
    const storeModel = await Store.findByPk(id, {
        include: ALL_INCLUDES,
        attributes: SERVE_ATTRIBUTES
    });
    if(!storeModel) throw new ApplicationError('Store not found', 404);
    return storeModel.toJSON();
}

async function fetchStores(page = 1, where = {})
{
    const results = await Store.findAndCountAll({
        include: ALL_INCLUDES,
        attributes: SERVE_ATTRIBUTES,
        where,
        ...paginationOption(page, 20)
    });
    return reformatFindCountAll(results).itemsToJSON();
}

async function fetchStoreIdOfUser(userId) {
    const store = await Store.findOne({ 
        where: { userId }, 
        attributes: ['id'], 
        raw: true 
    }) 
    if(!store) throw new ApplicationError('No associated store id found', 404);
    
    return store.id;
}

async function createStore(storeData, userId) 
{ 
    await ensureCanCreate(userId);
    return await Store.create({...storeData, userId});
}
async function updateStore(storeData, requester)
{
    let store = await fetchStore(requester.storeId);
    return await Store.update(storeData, { where: { id: store.id } });;
}
async function updateStoreImage(image, requester)
{
    let store = await fetchStore(requester.storeId);
    let result;
    await Store.sequelize.transaction( async t => {
        const [newImage] = await imageServices.createImages([image], requester.id);
        result = await Store.update({imageId: newImage.id}, {where: { id: store.id }});
    
        if(store.image) await imageServices.deleteImages([store.image.id], requester.id);
    })

    return result;
}

async function deleteStore(id)
{
    // temporary fix. Use DDD to recursively delete the rest of the properties (product, order, images, etc)
    return await Store.destroy({where: { id }})
}
async function ensureCanCreate(userId)
{
    const userRole = await userServices.fetchUserRole(userId);
    if(userRole != userServices.ROLES.StoreManager) throw new ApplicationError("User not a store manager", 403);
}

const SERVE_ATTRIBUTES = ['id', 'name', 'description', 'bankAccount', 'bankName']
const ALL_INCLUDES = [
    userServices.include('contacts'),
    {
        ...imageServices.include('serve'),
        as: 'image',
    },
    {
        ...imageServices.include('serve'),
        as: 'qrImage'
    },
];

function include(level)
{
    switch (level) {
        case 'serveName':
            return {
                model: Store,
                attributes: ['name']
            }
        case 'serveWithAll':
            return {
                model: Store,
                include: ALL_INCLUDES,
                attributes: SERVE_ATTRIBUTES
            }
        default:
            return {
                model: Store
            }
    }
}
export default  { fetchStore, fetchStoreIdOfUser, fetchStores, createStore, updateStore, updateStoreImage, deleteStore, include }