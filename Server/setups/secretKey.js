import crypto from 'crypto';

export default function secretKey()
{
    return crypto.randomBytes(64).toString('hex');
}

const secretKey = secretKey();
console.log(secretKey);