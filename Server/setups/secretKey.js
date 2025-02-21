import crypto from 'crypto';

export default function secretKey()
{
    return crypto.randomBytes(64).toString('hex');
}

const secret = secretKey();
console.log(secret);