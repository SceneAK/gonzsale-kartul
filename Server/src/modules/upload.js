import upath from  'upath';
import multer from 'multer';
import { promises as fs} from 'fs';
import { STATIC_ROUTE_NAME, PUBLIC_DIR } from '../../initialize.js';
import connectionPromise from '../modules/db.js'
const connection = await connectionPromise;

const MAX_SIZE_USER = 300 * 1024 * 1024; // 300mb
const MULTER_MAX_BODY_BYTES = 5 * 1024; // 5kb
const MULTER_MAX_FILE_BYTES = 5 * 1024 * 1024;

async function getUsed(req)
{
    const[rows] = await connection.execute(`SELECT * FROM users WHERE user_id = ?`, [req.authUser.id]);
    return rows[0].user_used_storage;
}
async function ensureBelowLimit(req, res, next)
{
    const usedStorage = await getUsed(req);
    if(usedStorage >= MAX_SIZE_USER) {
        res.status(400).send("Used Storage Limit!"); 
        return;
    }else{
        next();
    }
}

function aboveLimit(body)
{
    const textSize = JSON.stringify(body).length; 
    return textSize > MULTER_MAX_BODY_BYTES;
}
function createMulter(options)
{
    const {relativeDir} = options;
    const upload = multer({dest: upath.join(PUBLIC_DIR, relativeDir), limits: { fileSize: MULTER_MAX_FILE_BYTES} });

    const limitUpload = (upload)=>(req, res, next) =>{
        upload(req, res, err => {
            if(err) return next(err);
            if(aboveLimit(req.body)) return res.status(413).send('Payload too large'); 

            next();
        })
    }

    let uploadMiddle = getUploadMiddleware(upload, options);
    return limitUpload(uploadMiddle);
}
function getUploadMiddleware(upload, options)
{
    const { type, keyName, fields } = options;
    switch (type) {
        case 'fields':
            return upload.fields(fields)
        case 'array':
            return upload.array(keyName)
        default:
            return upload.single(keyName)
    }
}


function buildURL(protocol, host, relativePath)
{
    return `${protocol}://${host}/${STATIC_ROUTE_NAME}/${relativePath}`;
}
function getRelative(path)
{
    return upath.relative(PUBLIC_DIR, path);
}
function getFileRelative(files)
{
    return files.map(file => getRelative(file.path));
}

async function addAmountToUsed(amount, id)
{
    return await connection.execute(`UPDATE users SET user_used_storage = user_used_storage + ? WHERE user_id = ?`, [amount, id]);
}
async function updateUsed(files, id)
{
    let total = 0;
    files.forEach( file=> {
        total += file.size;
    });
    addAmountToUsed(total, id);
}
async function unlinkStoredUpdateUsed(paths, id)
{
    let absSize = 0;
    paths.forEach(relPath => {
        const path = upath.join(PUBLIC_DIR, relPath)
        fs.unlink(path, async err=>{
            if(!err) {
                const size = fs.stat(relPath).size;
                absSize += size;
            }
        }).catch(err => console.log(err.message));
    });
    addAmountToUsed(-absSize, id);
}
async function unlink(files)
{
    files.forEach(file => {
        fs.unlink(file.path, err => {
            if(err) console.log(err)
        })
    });
}

export {
    buildURL,
    getRelative,
    getFileRelative,

    ensureBelowLimit,
    createMulter,

    updateUsed,
    unlinkStoredUpdateUsed,
    unlink
};
