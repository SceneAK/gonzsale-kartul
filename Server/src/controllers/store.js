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
    delete stores[0].owner_user_id;
    res.json({...stores[0], owner: owners[0]});
}

const createStore = async (req, res) =>
{
    const {authUser, file, body} = req;
    try
    {
        if(authUser.role != 'STORE_MANAGER'){
            res.status(400).send('Only Store Creators can create their own stores'); return;
        }

        let imgRelPath = null;
        if(file){
            imgRelPath = getRelative(file.path);
            updateUsed([file], authUser.id);
        }
        
        const {store_name, store_payment_method, store_bank_account} = body;
        const store_id = v4();
        await connection.execute("INSERT INTO stores (store_id, owner_user_id, store_name, store_payment_method, store_bank_account, store_imgSrc) VALUES (?, ?, ?, ?, ?, ?)", [
            store_id,
            authUser.id,
            store_name,
            store_payment_method,
            store_bank_account,
            imgRelPath
        ])
        
        res.json({store_id});
    }catch(err)
    {
        if( file != undefined ) unlink([file]);        
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

    if(file != undefined)
    {
        try
        {
            unlinkStoredUpdateUsed([store.store_imgSrc], authUser.id);
            
            const relPath = getRelative(file.path);
            await connection.execute("UPDATE stores SET store_imgSrc = ? WHERE store_id = ?", [relPath, store.store_id]);
            updateUsed([file], authUser.id);
        }catch(err){unlink(file);}
    }

    res.status(204).send("updated");
}

export default  { getStore, createStore, updateStore }