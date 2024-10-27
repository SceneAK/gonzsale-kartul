let connection;
(async () => { 
    connection = await require("../modules/db")
})()

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

module.exports = { getStore, createStore }

// Update Store Name & Img
// Delete Store
// Get Ongoing Orders