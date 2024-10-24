const {execute} = require("../modules/db")

const getProducts = async (req, res) => {
    const [rows] = await executeFiltered(req.body);
    res.json(rows);
}
async function executeFiltered(filter)
{
    let query = `SELECT * FROM Product WHERE 1=1`;
    let params = [];
    if(filter.product_name != undefined)
    {
        query += ` AND product_name LIKE ? COLLATE utf8mb4_general_ci`; // case insensitive
        params.push(`${filter.product_name}%`);
    }
    if(filter.product_category != undefined)
    {
        query += ` AND product_category LIKE ?`;
        params.push(`${filter.product_category}%`);
    }
    if(filter.store_id != undefined)
    {
        query += ` AND store_id LIKE ?`;
        params.push(`${filter.store_id}%`);
    }
    
    return await execute(query, params);
}

const getProduct = async (req, res) => {
    const {id} = req.params;
    const [rows] = await execute('SELECT * FROM Product WHERE id = ?', [id]);
    res.json(rows[0]);
}

const createProduct = async (req, res) => {
    
}

module.exports = {
    getProduct,
    getProducts,
    createProduct
}