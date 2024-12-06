import connectionPromise from '../modules/db.js'
import {buildURL, getRelative, unlink, unlinkStoredUpdateUsed, updateUsed} from '../modules/upload.js';
const connection = await connectionPromise;

const getStore = async (req, res) =>
{
    const {store_id} = req.params;
    const [rows] = await connection.execute('SELECT * FROM store WHERE store_id = ?', [store_id]);
    if(rows.length == 0){
        return res.status(400).send('Store Not Found');
    }

    rows[0].store_imgSrc = buildURL(req.protocol, req.host, rows[0].store_imgSrc);
    res.json(rows[0]);
}

const createStore = async (req, res) =>
{
    const {authUser, file, body} = req;
    try
    {
        console.log(authUser.id, authUser.role);
        if(authUser.role != 'STORE_CREATOR')
        {
            res.status(400).send('Only Store Creators can create their own stores'); return;
        }

        let imgRelPath = null;
        if(file)
        {
            imgRelPath = getRelative(file.path);
            updateUsed([file], authUser.id);
        }
        
        const ownerId = body.owner_user_id != undefined ? body.owner_user_id : authUser.id; 
        const [result] = await connection.execute("INSERT INTO store (owner_user_id, store_name, store_imgSrc) VALUES (?, ?, ?)", [
            ownerId,
            body.store_name,
            imgRelPath
        ])
        
        res.json({insertId: result.insertId});
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
    const {body, authUser, file} = req;
    
    const store = await getUserStore(authUser.id)
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
        unlinkStoredUpdateUsed([store.store_imgSrc], authUser.id);

        const relPath = getRelative(file.path);
        await connection.execute("UPDATE store SET store_imgSrc = ? WHERE store_id = ?", [relPath, store.store_id]);
        updateUsed([file]);
    }

    res.status(204);
}

export default  { getStore, createStore, updateStore }