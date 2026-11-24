import { AppError } from "./errors.js";

const RESERVED_CODES = new Set(['api', 'docs', 'health']);
const ALIAS_PATTERN = /^[a-zA-Z0-9_-]{3,20}$/;

export function validateUrl(rawUrl)
{
    if (!rawUrl || typeof rawUrl !== 'string')
    {
        throw new AppError(400, 'INVALID_URL', 'Field "url" is required and must be a string');
    }
    const trimmed = rawUrl.trim();
    let parsed;

    try
    {
        parsed = new URL(trimmed);
    }
    catch
    {
        throw new AppError(400, 'INVALID_URL', 'Provided URL has invalid format');
    }

    if(parsed.protocol !== 'http:' && parsed.protocol !== 'https:')
    {
        throw new AppError(400, 'INVALID_PROTOCOL', 'Only http and https protocols are allowed');
    }
    
    return parsed.toString();
}

export function validateAlias(alias)
{
    if(typeof alias !== 'string' || !ALIAS_PATTERN.test(alias))
    {
        throw new AppError(400, 'INVALID_ALIAS', 'Alias must be 3-20 characters long and contain only letters, digits, underscores, or hyphens');
    }
    if(RESERVED_CODES.has(alias.toLowerCase()))
    {
        throw new AppError(409, 'ALIAS_RESERVED', 'This alias is reserved by the system');
    }
    return alias;
}