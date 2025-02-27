import { generateFilename } from '../common/index.js';
import upath from 'upath';
import createMulter from './multerMiddleware.js';
import upload from '../systems/upload.js'
import { getFilesIfAny } from '../common/multerUtils.js';

const createUpload = (relativeDir, options) => (req, res, next) => {
    res.on('finish', () => {
        if(res.statusCode < 400){
            const populatedFiles = getFilesIfAny(req);
            saveFilesAsRelativePath(populatedFiles);
        }
    })
    createMulter(options)(req, res, (err)=>{
        if(!err){
            const memStorageFiles = getFilesIfAny(req);
            populateWithRelativePath(memStorageFiles, relativeDir);
        }
        next(err);
    });
}
function saveFilesAsRelativePath(files)
{
    files.forEach( file => {
        upload.saveFile(file, file.relativePath);
    })
}
function populateWithRelativePath(files, relativeDir)
{
    files.forEach( file => {
        file.filename = generateFilename(file);
        file.relativePath = upath.join(relativeDir, file.filename);       
    })
}
export default createUpload;