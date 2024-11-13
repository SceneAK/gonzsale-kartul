import fs from 'fs';
import connectionPromise from '../modules/db.js'
const connection = await connectionPromise;

const getStore = async (req, res) =>
{
    const {store_id} = req.params;
    const [rows] = await connection.execute('SELECT * FROM store WHERE store_id = ?', [id]);
    res.json(rows[0]);
}

const createStore = async (req, res) =>
{
    const result = await connection.execute("INSERT INTO store (store_name, owner_user_id_fk, store_imgSrc) VALUES (?, ?, ?)", [
        req.body.store_name,
        req.authenticatedUserId,
        req.body.store_imgSrc
    ])
    res.json({insertedId: result.insertedId});
}

async function userOwnsStore(user_id, store_id)
{
    const [rows] = connection.execute("SELECT * FROM store WHERE store_id = ?", [store_id]);
    return rows[0].owner_user_id_fk == user_id;
}
const updateStore = async (req, res) =>
{
    if(!(store_id in req.body)) { res.status(400).send('No Store ID Provided'); return; }
    if(!(await userOwnsStore(req.authenticatedUserId, req.body.store_id))) { res.status(401).send('Only Store owner can edit'); return;}
    
    if(store_name in req.body)
    {
        connection.execute("UPDATE store SET store_name = ? WHERE store_id = ?", [req.body.store_name, req.body.store_id]);
    }

    if(url in req)
    {
        const [rows] = connection.execute("SELECT * FROM store WHERE store_id = ?", [req.body.store_id]);
        rows[0].store_imgSrc; // delete it first
        fs.unlink()

        connection.execute("UPDATE store SET store_imgSrc = ? WHERE store_id = ?", [req.url, req.body.store_id]);
    }
}

export { getStore, createStore, updateStore }