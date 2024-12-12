import { v4 } from 'uuid';
import connectionPromise from '../modules/db.js'
import {buildURL, getRelative, unlink, unlinkStoredUpdateUsed, updateUsed} from '../modules/upload.js';
import { generateUpdateQuery } from './common.js';
const connection = await connectionPromise;

const getStore = async (req, res) =>
{
    const {id} = req.params;
    const [stores] = await connection.execute('SELECT * FROM stores WHERE store_id = ?', [id]);

    if(stores.length == 0){
        return res.status(400).send('Store Not Found');
    }

    const [owners] = await connection.execute('SELECT user_name, user_email, user_phone FROM users WHERE user_id = ?', [stores[0].owner_user_id])
    
    stores[0].store_imgSrc = buildURL(req.protocol, req.hostname, stores[0].store_imgSrc);
    stores[0].store_QR_imgSrc = buildURL(req.protocol, req.hostname, stores[0].store_QR_imgSrc);
    delete stores[0].owner_user_id;
    res.json({...stores[0], owner: owners[0]});
}

const getOwnedStore = async (req, res) =>{
    const store = await getUserStore(req.authUser.id)
    res.json(store);
}

function splitAndTrackFiles(files)
{
    let store_imgSrc = null;
    let store_QR_imgSrc = null;
    if(files){
        const relPaths = getRelative(files.path); 
        store_imgSrc = relPaths[0];
        store_QR_imgSrc = relPaths[1]; // can be undefined
        updateUsed([files], authUser.id);
    }
    return {store_imgSrc, store_QR_imgSrc};
}

const createStore = async (req, res) =>
{
    const {authUser, files, body} = req;
    try
    {
        if(authUser.role != 'STORE_MANAGER'){
            res.status(400).send('Only Store Creators can create their own stores'); return;
        }

        const {store_imgSrc, store_QR_imgSrc} = files;
        
        const {store_name, store_description, store_payment_method, store_bank_account} = body;
        const store_id = v4();
        await connection.execute("INSERT INTO stores (store_id, owner_user_id, store_name, store_description, store_QR_imgSrc, store_payment_method, store_bank_account, store_imgSrc) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
            store_id,
            authUser.id,
            store_name,
            store_description,
            store_QR_imgSrc,
            store_payment_method,
            store_bank_account,
            store_imgSrc
        ])
        
        updateUsed(Object.values(files));
        res.json({store_id});
    }catch(err)
    {
        if( files != undefined ) unlink([Object.values(files)]);        
        return res.status(500).send("ERR\n" + err);
    }
}

async function getUserStore(user_id)
{
    const [rows] = await connection.execute("SELECT * FROM stores WHERE owner_user_id = ?", [user_id]);
    return rows.length > 0 ? rows[0] : null;
}
const updateStore = async (req, res) => // expects form-data
{
    const {body, authUser, files} = req;
    
    const store = await getUserStore(authUser.id)
    if(store == null) { 
        return res.status(401).send('user does not own a store'); 
    }
    
    const {query, params} = generateUpdateQuery(body, "stores", "store_id", store_id);;
    connection.execute(query, params);

    const {store_imgSrc, store_QR_imgSrc} = files;

    tryChange(store_imgSrc, store.store_imgSrc, 'store_imgSrc', authUser.id);
    tryChange(store_QR_imgSrc, store.store_QR_imgSrc, 'store_QR_imgSrc', authUser.id);
    
    updateUsed(Object.values(files), authUser.id)

    res.status(204).send("updated");
}
async function tryChange(newSrc, oldSrc, fieldNameInDb, owner_id)
{
    if(newSrc){
        const result = change(oldSrc, newSrc, fieldNameInDb, owner_id);
        if(!result) unlink(newSrc);
    }
}
async function change(oldSrc, newSrc, fieldNameInDb, owner_id)
{
    try
    {
        await connection.execute(`UPDATE stores SET ${fieldNameInDb} = ? WHERE owner_user_id = ?`, [newSrc, owner_id]);
    }catch(err){return false;}
    unlinkStoredUpdateUsed([oldSrc], owner_id);
    return true;
}

export default  { getStore, getOwnedStore, createStore, updateStore }