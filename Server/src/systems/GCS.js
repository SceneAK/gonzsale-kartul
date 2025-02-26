import { env } from "../../initialize.js";
import { Storage } from '@google-cloud/storage';
import { logger } from "./logger.js";

const storage = new Storage({
    credentials: JSON.parse(env.GCS_KEY),
    projectId: env.GCP_PROJECT_ID,
});
const bucket = storage.bucket(env.GCS_BUCKET_NAME);

function completePublicURL(gcsFilename)
{
    return `https://storage.googleapis.com/${bucket.name}/${gcsFilename}`;
}

async function fetchFileMetadata(gcsFilename)
{
    const [metadata] = await bucket.file(gcsFilename).getMetadata();
    return metadata;
}
async function uploadFile(file, filename)
{
    const gcsBlob = bucket.file(filename);
    const blobStream = gcsBlob.createWriteStream({
        resumable: false,
        gzip: true,
        metadata: { contentType: file.mimetype },
    });
    await new Promise((resolve, reject) => {
        blobStream.on('error', (err) => reject(err));
        blobStream.on('finish', () => {
            gcsBlob.makePublic().then(resolve).catch(reject);
        });
        blobStream.end(file.buffer);
    });
}
async function deleteFilename(gcsFilename)
{
    try{
        return await bucket.file(gcsFilename).delete();
    }catch(err){
        logger.info('Could not delete gcs file: ' + JSON.stringify(err));
    }
}

export default { uploadFile, deleteFilename, completePublicURL, fetchFileMetadata }