import upath from  'upath';
import multer from 'multer';
import { promises as fs} from 'fs';
import { STATIC_ROUTE_NAME, PUBLIC_DIR } from '../../initialize.js';
import connectionPromise from '../modules/db.js'
const connection = await connectionPromise;

const MAX_SIZE = 300000000; // 300mb
async function getUsed(req)
{
    const[rows] = await connection.execute(`SELECT * FROM user WHERE user_id = ?`, [req.authenticatedUserId]);
    return rows[0].user_used_storage;
}
async function ensureBelowLimit(req, res, next)
{
    const usedStorage = await getUsed(req);
    if(usedStorage >= MAX_SIZE) {
        res.status(400).send("Used Storage Limit!"); 
        return;
    }else{
        next();
    }
}
function createMulter(options)
{
    const {isArray, relativeDir, keyName} = options;
    const upload = multer({dest: upath.join(PUBLIC_DIR, relativeDir) });
    if(isArray)
    {
        return upload.array(keyName);
    }else{
        return upload.single(keyName);
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

async function addAmountToUsed(amount, id)
{
    return await connection.execute(`UPDATE user SET user_used_storage = user_used_storage + ? WHERE user_id = ?`, [amount, id]);
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
        fs.unlink(relPath, async err=>{
            if(err) {
                console.log(err)
            }
            else {
                const size = fs.stat(relPath).size;
                absSize += size;
            }
        })
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

    ensureBelowLimit,
    createMulter,

    updateUsed,
    unlinkStoredUpdateUsed,
    unlink
};
