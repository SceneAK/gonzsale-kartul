import multer from 'multer';
import upath from 'upath';
import fs from 'fs';
import { PUBLIC_DIR } from '../../initialize.js';
import { ApplicationError, getFilesIfAny, logger } from '../common/index.js';

const MULTER_MAX_FILE_BYTES = 10 * 1024 * 1024;

function createMulter(options)
{
    const { relativeDir, mimeType } = options;
    const upload = multer({
        dest: upath.join(PUBLIC_DIR, relativeDir), 
        limits: { fileSize: MULTER_MAX_FILE_BYTES },
        fileFilter: createMimeTypeFilterer(mimeType ? mimeType : 'any')
    });
    return getUploadMiddleware(upload, options);
}

function onErrorFileDeletion(err, req, res, next)
{
    const paths = getFilesIfAny(req).map(file => file.path);

    console.log(paths);
    paths.forEach( path => {
            if(path) fs.unlink(path, err => {
                if(err) logger.info(`Failed to delete ${path}`)
            })
        }
    );
    next(err)
}

function getUploadMiddleware(upload, options)
{
    const { type, keyName, fields, maxCount } = options;
    switch (type) {
        case 'fields':
            return upload.fields(fields)
        case 'array':
            return upload.array(keyName, maxCount)
        default:
            return upload.single(keyName)
    }
}

function createMimeTypeFilterer(mimetype)
{
    return (req, file, cb) => {
        const condition = mimetype == 'any' || file.mimetype.startsWith(mimetype)
        if(condition)
        {
            cb(null, true)
        }else{
            cb(new ApplicationError("File uploaded not of expected type", 400), false);
        }
    };
}

export { createMulter, onErrorFileDeletion };