import { v4 } from 'uuid';
import connectionPromise from '../modules/db.js'
import {buildURL, getRelative, unlink, unlinkStoredUpdateUsed, updateUsed} from '../modules/upload.js';
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

        const {store_imgSrc, store_QR_imgSrc} = splitAndTrackFiles(req.files);
        
        const {store_name, store_payment_method, store_bank_account} = body;
        const store_id = v4();
        await connection.execute("INSERT INTO stores (store_id, owner_user_id, store_name, store_QR_imgSrc, store_payment_method, store_bank_account, store_imgSrc) VALUES (?, ?, ?, ?, ?, ?, ?)", [
            store_id,
            authUser.id,
            store_name,
            store_QR_imgSrc,
            store_payment_method,
            store_bank_account,
            store_imgSrc
        ])
        
        res.json({store_id});
    }catch(err)
    {
        if( files != undefined ) unlink([files]);        
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
    const {body, authUser, file} = req;
    
    const store = await getUserStore(authUser.id)
    if(store == null) { 
        return res.status(401).send('user does not own a store'); 
    }
    
    if(body.store_name)
    {
        await connection.execute("UPDATE stores SET store_name = ? WHERE store_id = ?", [body.store_name, store.store_id]);
    }

    const {store_imgSrc, store_QR_imgSrc} = splitAndTrackFiles(req.files);

    if(store_imgSrc){
        const result = change(store.store_imgSrc, store_imgSrc, 'store_imgSrc', authUser.id);
        if(!result) unlink(req.files[0]); // files[0] = Store_imgSrc
    }
    if(store_QR_imgSrc){
        const result = change(store.store_QR_imgSrc, store_QR_imgSrc, 'store_QR_imgSrc', authUser.id);
        if(!result) unlink(req.files[1]); // files[0] = store_QR_imgSrc
    }
    updateUsed(files, authUser.id)

    res.status(204).send("updated");
}
async function change(relPath, newRelPath, key, owner_id)
{
    try
    {
        await connection.execute(`UPDATE stores SET ${key} = ? WHERE owner_user_id = ?`, [newRelPath, owner_id]);
    }catch(err){return false;}
    unlinkStoredUpdateUsed([relPath], owner_id);
    return true;
}

export default  { getStore, createStore, updateStore }