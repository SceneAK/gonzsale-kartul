import crypto from 'crypto';
import upath from 'upath';

export default function generateFilename(file)
{
    const rand = crypto.randomBytes(16).toString('hex');
    const ext = upath.extname(file.originalname);
    return `${Date.now()}-${rand}${ext}`;
}