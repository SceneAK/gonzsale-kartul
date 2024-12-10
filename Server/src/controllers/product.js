import { v4 } from 'uuid';
import connectionPromise from '../modules/db.js'
import { buildURL, getFileRelative, unlink, unlinkStoredUpdateUsed, updateUsed } from '../modules/upload.js';
import { generateUpdateQuery } from './common.js';
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
    let filter = req.body ? req.body : {};

    if(req.params.product_category != "all"){
        filter.product_category = req.params.product_category;
    }

    let [rows] = await executeFiltered(filter);

    rows = prepareImgUrls(req.protocol, req.hostname, rows);
    res.status(200).json(rows);
}
async function executeFiltered(filter)
{
    let query = `SELECT p.* FROM products p`;
    let params = [];
    
    if(filter.store_name)
    {
        query += ` INNER JOIN stores s ON p.store_id = s.store_id WHERE s.store_name LIKE ? COLLATE utf8mb4_general_ci`
        params.push(`${filter.store_name.trim()}%`);
        
    }else{
        query += ` WHERE 1=1`;
    }
    if(filter.product_name)
    {
        query += ` AND p.product_name LIKE ? COLLATE utf8mb4_general_ci`; // case insensitive
        params.push(`${filter.product_name}%`);
    }
    if(filter.product_category)
    {
        query += ` AND p.product_category LIKE ? COLLATE utf8mb4_general_ci`;
        params.push(`${filter.product_category}%`);
    }
    if(filter.store_id)
    {
        query += ` AND s.store_id LIKE ?`;
        params.push(`${filter.store_id}%`);
    }
    
    return connection.execute(query, params);
}

const getProduct = async (req, res) => {
    const {id} = req.params;
    let [rows] = await connection.execute('SELECT * FROM products WHERE product_id = ?', [id]);
    rows = prepareImgUrls(req.protocol, req.hostname, rows);
    res.json(rows);
}


const createProduct = async (req, res) => {
    const [rows] = await connection.execute("SELECT * FROM stores WHERE owner_user_id = ?", [req.authUser.id]);
    if(rows.length == 0) {
        return res.status(400).send("Create a store!");
    }

    try{
        const relPaths = getFileRelative(req.files);
        const {product_name, product_description, product_category, product_variants, product_price, product_unit, product_availability} = req.body;
        const parsed = JSON.parse(product_variants);

        const product_id = v4();
        await connection.execute("INSERT INTO products (product_id, product_name, product_description, product_imgSrc, product_category, product_variants, product_price, product_unit, product_availability, store_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",[
            product_id,
            product_name,
            product_description,
            relPaths,
            product_category,
            parsed,
            product_price,
            product_unit,
            product_availability,
            rows[0].store_id
            ]
        )
        updateUsed(req.files, req.authUser.id);
        res.status(200).send({product_id});
    }catch(err) { 
        if(req.files != undefined) unlink(req.files);
        return res.status(500).send("ERR\n" + err);
    }
}

const editProduct = async(req, res) => {
    const {body, files, authUser} = req;
    const product_id = req.params.id;

    const [rows] = await connection.execute("SELECT s.store_id FROM products p INNER JOIN stores s ON p.store_id = s.store_id WHERE s.owner_user_id = ? AND p.product_id = ?", [req.authUser.id, product_id]);
    if(rows.length == 0) {
        return res.status(400).send("Product not owned!");
    }

    if(files.length != 0){
        try
        {
            const [rows] = await connection.execute("SELECT product_imgSrc FROM products WHERE product_id = ?", [product_id]); 
            unlinkStoredUpdateUsed(rows[0].product_imgSrc, authUser.id);
            const relPaths = getFileRelative(files)
            body.product_imgSrc = relPaths;
        }catch (err) { return res.status(500).send(err.message); }
    }
    
    const {query, params} = generateUpdateQuery(body, "products", "product_id", product_id);

    try{
        await connection.execute(query, params);
        res.status(204).send("updated");
    }catch(err)
    {
        res.status(500).send("ERR\n" + err);
    }
}

export default {
    getProduct,
    editProduct,
    getProducts,
    createProduct
};

// TODO: Delete Product