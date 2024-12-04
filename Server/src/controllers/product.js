import connectionPromise from '../modules/db.js'
import { buildURL, getRelative, unlink, updateUsed } from '../modules/upload.js';
const connection = await connectionPromise;

function includeCategoryInBody(req, category)
{
    if(req.body != undefined) {
        req.body.product_category = category; 
    }else{
        req.body = {product_category: category};
    }
    
    return req;
}

function prepareProductImgUrls(protocol, host, rows)
{
    return rows.map( row => {
        const relPaths = JSON.parse(row.product_imgSrc);
        row.product_imgSrc = relPaths.map( relPath => buildURL(protocol, host, relPath) );
    })
}
const getProducts = async (req, res) => {
    req = includeCategoryInBody(req, req.params.product_category);
    const [rows] = await executeFiltered(req.body);

    rows = prepareProductImgUrls(rows);
    res.status(200).json(rows);
}
async function executeFiltered(filter)
{
    let query = `SELECT * FROM product WHERE 1=1`;
    let params = [];
    if(filter.product_name != undefined)
    {
        query += ` AND product_name LIKE ? COLLATE utf8mb4_general_ci`; // case insensitive
        params.push(`${filter.product_name}%`);
    }
    if(filter.product_category != undefined)
    {
        query += ` AND product_category LIKE ? COLLATE utf8mb4_general_ci`;
        params.push(`${filter.product_category}%`);
    }
    if(filter.store_id != undefined)
    {
        query += ` AND store_id LIKE ?`;
        params.push(`${filter.store_id}%`);
    }
    if(filter.store_name != undefined)
    {
        query += ` AND store_name LIKE ? COLLATE utf8mb4_general_ci`;
        params.push(`${filter.store_name}%`);
    }
    
    return connection.execute(query, params);
}

const getProduct = async (req, res) => {
    const {id} = req.params;
    const [rows] = await connection.execute('SELECT * FROM product WHERE product_id = ?', [id]);

    rows = prepareProductImgUrls(rows);
    res.json(rows[0]);
}

const createProduct = async (req, res) => { // Expects upload to process form-data into req.body and req.files
    const [rows] = await connection.execute("SELECT * FROM store WHERE owner_user_id = ?", [req.authenticatedUserId]);
    
    if(rows.length == 0) {
        res.status(400).send("Create a store!"); return;
    }
    if(!isValid(req.body)) {
        res.status(400).send("Bad Request!"); return;
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
        updateUsed(req.files, req.authenticatedUserId);
        res.status(200).send({insertId: result.insertId});
    }catch(err) { 
        if(req.files != undefined) unlink(req.files);
        res.status(400).send(err.message); 
    }

    function isValid(body)
    {
        const defined = (value) => value in body;
        return defined('product_name') && defined('product_description') && defined('product_category');
    }
}

export {
    getProduct,
    getProducts,
    createProduct
};

// TODO: Update Product, Delete Product