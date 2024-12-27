import imageServices from './imageServices.js';
import userServices from './userServices.js';
import databaseInitializePromise from '../database/initialize.js'
const { Store } = await databaseInitializePromise;

async function fetchStore(id)
{
    const storeModel = await Store.scope(exportScopes).findByPk(id);
    if(!storeModel) throw new Error('Store not found');
    return storeModel.get();
}

async function fetchStoreOfUser(userId)
{
    const storeModel = await Store.scope(exportScopes).findOne({ where: { userId } });
    if(!storeModel) throw new Error('No store owned');
    
    return storeModel.get();
}

async function fetchStoreIdOfUser(userId) {
    const store = await Store.findOne({ where: { userId }, attributes: ['id'] }) 
    if(!store) throw new Error('No storeId found');
    return store.get('id');
}

async function createStore(storeData, files, decodedAuthToken) 
{ 
    await ensureCanCreateStore(decodedAuthToken);

    await Store.sequelize.transaction( async t => {
        const completeData = prepareStoreData(storeData, files, decodedAuthToken);
        await Store.create(completeData);
    });
    return { result: 'created' };
}

async function updateStore(storeData, files, decodedAuthToken)
{
    const storeId = await fetchStoreIdOfUser(decodedAuthToken.id);

    await Store.sequelize.transaction( async t => {
        const completeData = prepareStoreData(storeData, files, decodedAuthToken);
        await Store.update(completeData, { where: { id: storeId } });
    });
    return { result: 'updated' };
}

async function prepareStoreData(storeData, files, decodedAuthToken)
{
    const [imageId, qrImageId] = await imageServices.createImagesKeepNull(files, decodedAuthToken);
    return {...storeData, imageId, qrImageId, userId: decodedAuthToken.id};
}

async function ensureCanCreateStore(decodedAuthToken)
{
    const user = await userServices.fetchUserInfo(decodedAuthToken.id);
    if(user.role != 'STORE_MANAGER') throw new Error("Not a store manager");
}

const exportScopes = ['withImage', 'withQrImage', 'withOwner'];

export default  { fetchStore, fetchStoreOfUser, fetchStoreIdOfUser, createStore, updateStore }