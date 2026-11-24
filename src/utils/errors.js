export class AppError extends Error
{
    constructor(statusCode, code, message)
    {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}

export function errorHandler(err, req, res, next)
{
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err)
    {
        return res.status(400).json({error: {code: 'INVALID_JSON', message: 'Malformed JSON in request body'}});
    }

    const statusCode = err.statusCode || 500;
    const code = err.code || 'INTERNAL_ERROR';
    const message = err.statusCode ? err.message : 'Unexpected internal server error';

    res.status(statusCode).json({error:{code, message}})
}

