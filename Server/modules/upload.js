const express = require('express');
const upath = require('upath');
const multer = require("multer");
const { SOURCE_ROUTE_NAME, PUBLIC_DIR } = require('../server');
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
function addUsedStorage(amount, id)
{
    connection.execute(`UPDATE user SET user_used_storage = user_used_storage + ? WHERE id = ?`, [amount, id]);
}
const ensureLimited = async (req, res, next) =>
{
    const[rows] = await connection.execute(`SELECT * FROM user WHERE user_id = ?`, [req.authenticatedUserId]);
    if(rows[0].user_used_storage < MAX_SIZE)
    {
        next();
    }else{
        res.status(400).send("Used Storage Limit");
    }
}

const uploadImg = multer({ dest: upath.join(PUBLIC_DIR, 'images') });
const imageRouter = express.Router();

imageRouter.post('/', ensureLimited, uploadImg.single('image'), (req, res, next) => {
    req.url = buildURL(req.protocol, req.get('host'), req.file.path);
    addUsedStorage(req.file.size, req.authenticatedUserId);
    next();
});

const imagesRouter = express.Router();
imagesRouter.post('/', ensureLimited, uploadImg.array('images', 7), (req, res, next) => { // max number of files = 7
    let array = [];
    req.files.forEach( value => {
        array.push(buildURL(req.protocol, req.get('host'), value.path)) 
        addUsedStorage(req.file.size, req.authenticatedUserId); 
    });
    req.urls = array;
    console.log(`Image Sources: ${req.urls}`);
    next();
});

module.exports = {
    imageRouter,
    imagesRouter
};