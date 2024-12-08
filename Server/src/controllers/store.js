import connectionPromise from '../modules/db.js'
import {buildURL, getRelative, unlink, unlinkStoredUpdateUsed, updateUsed} from '../modules/upload.js';
const connection = await connectionPromise;

const getStore = async (req, res) =>
{
    const {store_id} = req.params;
    const [rows] = await connection.execute('SELECT * FROM store WHERE store_id = ?', [store_id]);
    rows[0].store_imgSrc = buildURL(req.protocol, req.host, rows[0].store_imgSrc);
    res.json(rows[0]);
}

const createStore = async (req, res) =>
{
    const {authenticatedUserId, file, body} = req;
    try
    {   
        const imgRelPath = getRelative(file.path);
        const result = await connection.execute("INSERT INTO store (owner_user_id, store_name, store_imgSrc) VALUES (?, ?, ?)", [
            authenticatedUserId,
            body.store_name,
            imgRelPath
        ])
        updateUsed([file], authenticatedUserId);
        res.json({insertedId: result.insertedId});
    }catch(err)
    {
        if( file != undefined ) unlink([file]);        
        res.status(400).send(err.message);
    }
}

async function getUserStore(user_id)
{
    const [rows] = await connection.execute("SELECT * FROM store WHERE owner_user_id = ?", [user_id]);
    return rows.length > 0 ? rows[0] : null;
}
const updateStore = async (req, res) => // expects form-data
{
    const {body, authenticatedUserId, file} = req;

    if(!(store in body)) { 
        res.status(400).send('No Store ID Provided'); 
        return; 
    }
    
    const store = await getUserStore(authenticatedUserId)
    if(store == null) { 
        res.status(401).send('user does not own a store'); 
        return;
    }
    
    if(store_name in body)
    {
        connection.execute("UPDATE store SET store_name = ? WHERE store_id = ?", [body.store_name, store.store_id]);
    }

    if(file != undefined)
    {
        unlinkStoredUpdateUsed([store.store_imgSrc], authenticatedUserId);

        const relPath = getRelative(file.path);
        await connection.execute("UPDATE store SET store_imgSrc = ? WHERE store_id = ?", [relPath, store.store_id]);
        updateUsed([file]);
    }

    res.status(204);
}

export { getStore, createStore, updateStore }