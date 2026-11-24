import crypto from 'node:crypto';

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const DEFAULT_LENGTH = 6;

export function generateShortCode(length = DEFAULT_LENGTH)
{
    const bytes = crypto.randomBytes(length);
    let result = '';

    for (let i = 0; i<length; i+=1)
    {
        result += ALPHABET[bytes[i] % ALPHABET.length];
    }

    return result;
}