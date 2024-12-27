import multer from 'multer';

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

const MULTER_MAX_BODY_BYTES = 5 * 1024; // 5kb
const MULTER_MAX_FILE_BYTES = 5 * 1024 * 1024;
function aboveLimit(body)
{
    const textSize = JSON.stringify(body).length; 
    return textSize > MULTER_MAX_BODY_BYTES;
}

export default createMulter;