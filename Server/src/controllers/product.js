import connectionPromise from '../modules/db.js'
import { buildURL, getRelative, unlink, updateUsed } from '../modules/upload.js';
const connection = await connectionPromise;

function prepareImgUrls(protocol, host, rows)
{
    return rows.map( row => {
        try
        {
            const relPaths = JSON.parse(row.product_imgSrc);
            if(row.product_imgSrc != undefined && row.product_imgSrc != null){
                row.product_imgSrc = relPaths.map( relPath => buildURL(protocol, host, relPath) );
            }
        }catch(err){    }
        
        return row;
    })
}
const getProducts = async (req, res) => {
    let filter = {};
    if(req.params.product_category != "All"){
        filter = req.body;
        filter.product_category = req.params.product_category;
    }

    let [rows] = await executeFiltered(filter);

    rows = prepareImgUrls(req.protocol, req.hostname, rows);
    res.status(200).json(rows);
}
async function executeFiltered(filter)
{
    let query = `SELECT * FROM product WHERE 1=1`;
    let params = [];
    
    if(filter.product_name != "")
    {
        query += ` AND product_name LIKE ? COLLATE utf8mb4_general_ci`; // case insensitive
        params.push(`${filter.product_name}%`);
    }
    if(filter.product_category != "")
    {
        query += ` AND product_category LIKE ? COLLATE utf8mb4_general_ci`;
        params.push(`${filter.product_category}%`);
    }
    if(filter.store_id != -1)
    {
        query += ` AND store_id LIKE ?`;
        params.push(`${filter.store_id}%`);
    }
    if(filter.store_name != "")
    {
        query += ` AND store_name LIKE ? COLLATE utf8mb4_general_ci`;
        params.push(`${filter.store_name}%`);
    }
    
    return connection.execute(query, params);
}

const getProduct = async (req, res) => {
    const {id} = req.params;
    let [rows] = await connection.execute('SELECT * FROM product WHERE product_id = ?', [id]);
    rows = prepareImgUrls(req.protocol, req.hostname, rows);
    res.json(rows);
}

const createProduct = async (req, res) => {
    const [rows] = await connection.execute("SELECT * FROM store WHERE owner_user_id = ?", [req.authUser.id]);
    if(rows.length == 0) {
        return res.status(400).send("Create a store!");
    }

    try{
        const relPaths = req.files.map( file => getRelative(file.path));
        const {product_name, product_description, product_category, product_price, product_unit, product_canOrder} = req.body;
        const [result] = await connection.execute("INSERT INTO product (product_name, product_description, product_imgSrc, product_category, product_price, product_unit, product_canOrder, store_id) VALUES (?, ?, ?, ?, ?)",
            [
            product_name,
            product_description,
            relPaths,
            product_category,
            product_price,
            product_unit,
            product_canOrder,
            rows[0].store_id
            ]
        )
        updateUsed(req.files, req.authUser.id);
        res.status(200).send({insertId: result.insertId});
    }catch(err) { 
        if(req.files != undefined) unlink(req.files);
        res.status(400).send(err.message); 
    }
}

export default {
    getProduct,
    getProducts,
    createProduct
};

// TODO: Update Product, Delete Product