import { PUBLIC_LOCAL_STORAGE_DIR, PUBLIC_LOCAL_STORAGE_ROUTE } from '../../initialize.js';
import fs from 'fs/promises';
import upath from 'upath';

function buildAccessURL(req, relativePath)
{
    return `${req.protocol}://${req.get('host')}/${PUBLIC_LOCAL_STORAGE_ROUTE}/${relativePath}`;
}

async function writeFile(file, relativePath)
{
    const path =  upath.join(PUBLIC_LOCAL_STORAGE_DIR, relativePath);
    await fs.writeFile(path, file.buffer);
}

async function readStat(relativePath)
{
    return await fs.stat(relativePath);
}

async function unlinkRelativePath(relativePath)
{
    await fs.unlink( upath.join(PUBLIC_LOCAL_STORAGE_DIR, relativePath) );
}

export default { writeFile, unlinkRelativePath, readStat, buildAccessURL }