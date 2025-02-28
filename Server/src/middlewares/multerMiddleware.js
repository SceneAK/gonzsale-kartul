import multer from 'multer';
import { ApplicationError } from '../common/index.js';
import { env } from '../../initialize.js'

const MULTER_MAX_FILE_BYTES = 2 * 1024 * 1024;

function createMulter(options)
{
    const { mimeType, ...uploadOptions } = options;
    const upload = multer({
        limits: { fileSize: env.MAX_FILE_SIZE || MULTER_MAX_FILE_BYTES },
        fileFilter: createMimeTypeFilterer(mimeType ? mimeType : 'any'),
        storage: multer.memoryStorage()
    });
    return getUploadMiddleware(upload, uploadOptions);
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
            return upload.single(keyName || "file")
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

export default createMulter;
