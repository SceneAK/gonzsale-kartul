import imageServices from './imageServices.js';
import userServices from './userServices.js';
import databaseInitializePromise from '../database/initialize.js'
import {ApplicationError} from '../common/index.js';
import fs from 'fs';
const { Store } = await databaseInitializePromise;

async function fetchStore(id)
{
    const storeModel = await Store.findByPk(id, {
        include: ALL_INCLUDES,
        attributes: SERVE_ATTRIBUTES
    });
    if(!storeModel) throw new ApplicationError('Store not found', 404);
    return storeModel.get();
}

async function fetchStoreOfUser(userId)
{
    const storeModel = await Store.findOne({ 
        where: { userId },
        include: ALL_INCLUDES,
        attributes: SERVE_ATTRIBUTES
    });
    if(!storeModel) throw new ApplicationError('No store owned', 404);
    
    return storeModel.get();
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

async function createStore(storeData, files, userId) 
{ 
    await ensureCanCreate(userId);

    await Store.sequelize.transaction( async t => {
        const completeData = await complete(storeData, files, userId);
        await Store.create(completeData);
    });

    return { result: 'created' };
}

async function updateStore(storeData, files, userId)
{
    const store = await Store.findOne({where: { userId }});
    
    const updateData = { ...storeData, userId };
    await Store.sequelize.transaction( async t => {

        await handleImage('imageId', updateData.imageAction, files.imageFile?.[0], store, updateData);
        await handleImage('qrImageId', updateData.qrImageAction, files.qrImageFile?.[0], store, updateData);
        console.log(updateData);
        await store.update(updateData);
    });

    return { result: 'updated' };
}
async function handleImage(fieldName, action, file, store, updateData)
{
    if(action)
    {
        console.log(store);
        if(store[fieldName] != null && action != 'keep')
        {
            console.log('deleted');
            await imageServices.deleteImages(store[fieldName], store.userId);
            updateData[fieldName] = null;
        }
        if(action == 'replace')
        {
            const [image] = await imageServices.createImages([file], store.userId)
            updateData[fieldName] = image.id;
        }
    }
    if(file && action != 'replace')
    {
        fs.unlink(file.path, () => {console.log('unlinked')});
    }
}
async function complete(storeData, files, userId)
{
    const {imageFile, qrImageFile} = files;
    const [image, qrImage] = await imageServices.createImagesKeepInvalids([imageFile?.[0], qrImageFile?.[0]], userId);
    const [imageId, qrImageId] = [image?.id, qrImage?.id];
    return { ...storeData, imageId, qrImageId, userId };
}

async function ensureCanCreate(userId)
{
    const user = await userServices.fetchUser(userId);
    if(user.role != 'STORE_MANAGER') throw new ApplicationError("User not a store manager", 403);
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
        case 'just-name':
            return {
                model: Store,
                attributes: ['name']
            }
        case 'serve':
            return {
                model: Store,
                include: ALL_INCLUDES,
                attributes: SERVE_ATTRIBUTES
            }
        default:
            return {
                model: Store,
                include: ALL_INCLUDES
            }
    }
}
export default  { fetchStore, fetchStoreOfUser, fetchStoreIdOfUser, createStore, updateStore, include }