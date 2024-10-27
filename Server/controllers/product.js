let connection;
(async () => { 
    connection = await require("../modules/db")
})()


const getProducts = async (req, res) => {
    const [rows, fields] = await executeFiltered(req.body);
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
        query += ` AND store_id_fk LIKE ?`;
        params.push(`${filter.store_id}%`);
    }
    return connection.execute(query, params);
}

const getProduct = async (req, res) => {
    const {id} = req.params;
    const [rows] = await connection.execute('SELECT * FROM Product WHERE product_id = ?', [id]);
    res.json(rows[0]);
}

const createProduct = async (req, res) => {
    const [rows] = await connection.execute("SELECT * FROM Store WHERE owner_user_id_fk = ?", [req.authenticatedUserId]);
    
    if(rows.length == 0) {
        res.status(400).send("Create a store!");
    }
    if(!isValid(req.body)) { 
        res.status(400).send("Bad Request!");
    }

    try{
        const [result] = await connection.execute("INSERT INTO Product (product_name, product_description, product_imgSrc, product_category, store_id_fk) VALUES (?, ?, ?, ?, ?)",
            [
            req.body.product_name,
            req.body.product_description,
            req.body.product_imgSrc,
            req.body.product_category,
            rows[0].store_id
            ]
        )
        res.status(200).send({insertId: result.insertId});
    }catch(err) { 
        res.status(400).send(err.message); 
    }


    function isValid(body)
    {
        const defined = (value) => value in body;
        return defined('product_name') && defined('product_description') && defined('product_imgSrc') && defined('product_category');
    }
}

module.exports = {
    getProduct,
    getProducts,
    createProduct
}

// TODO: Update Product, Delete Product