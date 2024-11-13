const upath = require('upath');
const multer = require("multer");
const { SOURCE_ROUTE_NAME, PUBLIC_DIR } = require('../../server');
let connection;
(async () => { 
    connection = await require("./db")
})()
console.log(SOURCE_ROUTE_NAME, PUBLIC_DIR);
function buildURL(protocol, host, fullFilePath)
{
    const path = upath.relative(PUBLIC_DIR, fullFilePath);
    return `${protocol}://${host}/${SOURCE_ROUTE_NAME}/${path}`;
}
function getFilePath(url)
{
    const start = url.indexOf(SOURCE_ROUTE_NAME) + SOURCE_ROUTE_NAME.length + 1; // +1 for the backslash after  
    const relative = url.substring(start);
    return upath.join(PUBLIC_DIR, relative);
}
function addUsedStorage(amount, id)
{
    connection.execute(`UPDATE user SET user_used_storage = user_used_storage + ? WHERE user_id = ?`, [amount, id]);
}

const MAX_SIZE = 300000000; // 300mb
async function reachedLimit(req)
{
    const[rows] = await connection.execute(`SELECT * FROM user WHERE user_id = ?`, [req.authenticatedUserId]);
    console.log("inner: " + rows[0].user_used_storage >= MAX_SIZE);
    return rows[0].user_used_storage >= MAX_SIZE;
}

const uploadImg = multer({ dest: upath.join(PUBLIC_DIR, 'images') });

const image = async (req, res, next) => {
    if(await reachedLimit(req)){
        res.status(400).send("Used Storage Limit!"); return;
    }

    uploadImg.single('image')(req, res, ()=>{ // parsed form-data
        req.url = buildURL(req.protocol, req.get('host'), req.file.path);
        addUsedStorage(req.file.size, req.authenticatedUserId);
        next();
    })
}

const images = async (req, res, next) => {
    if(await reachedLimit(req)){
        res.status(400).send("Used Storage Limit!!"); return;
    }

    uploadImg.array('images')(req, res, ()=>{
        let array = [];
        req.files.forEach( value => {
            array.push(buildURL(req.protocol, req.get('host'), value.path)) 
            addUsedStorage(value.size, req.authenticatedUserId); 
        });
        req.urls = array;
        console.log(`Image Sources: ${req.urls}`);
        next();
    }) 
}

module.exports = {
    image,
    images,
    buildURL,
    getFilePath
};