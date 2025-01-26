import upath from 'upath';
import { PUBLIC_DIR } from '../../initialize.js';

function getRelative(path)
{
    return upath.relative(PUBLIC_DIR, path);
}
function getFileRelative(files)
{
    return files.map(file => getRelative(file.path));
}
function getFull(relPath)
{
    return upath.join(PUBLIC_DIR, relPath);
}

export { getRelative, getFileRelative, getFull };