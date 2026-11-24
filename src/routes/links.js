import { Router } from 'express';
import db from '../db.js';
import { generateShortCode } from '../utils/codeGenerator.js';
import { AppError } from '../utils/errors.js';
import { validateAlias, validateUrl } from '../utils/validators.js';

const router = Router();
const baseUrl = (process.env.BASE_URL || 'http://localhost:8080').replace(/\/$/, '');



/================================================================ADD ROW==========================================================================================/



function formatLink(row)
{
    return{
        code: row.code,
        shortUrl: `${baseUrl}/${row.code}`,
        originalUrl: row.original_url,
        clicks: row.clicks,
        createdAt: row.created_at
    };
}

router.post('/api/links', async(req, res)=>
    {
       const {url, alias} = req.body || {};
       const validatedUrl = validateUrl(url);



/===========================WITH ALIAS==============================/



       if (alias !== undefined)
       {
        const validatedAlias = validateAlias(alias);

        try
        {
            const row = await db.one('INSERT INTO links (code, original_url) VALUES ($1, $2) RETURNING code, original_url, clicks, created_at',[validatedAlias, validatedUrl]);
            return res.status(201).location(`/api/links/${row.code}`).json(formatLink(row));
        }
        catch(error)
        {
            if(error.code === '23505')
            {
                throw new AppError(409, 'ALIAS_TAKEN', `Custom alias '${validatedAlias}' is already in use`);
            }
            throw error;
        }
       }
/===========================BASIC SHORT CODE==============================/




       for(let attempt=0; attempt <5;attempt+=1)
       {
        const code = generateShortCode();
        try
        {
            const row = await db.one ('INSERT INTO links (code, original_url) VALUES ($1, $2) RETURNING code, original_url, clicks, created_at',[code, validatedUrl]);
            return res.status(201).location(`/api/links/${row.code}`).json(formatLink(row));
        }
        catch(error)
        {
            if (error.code !== '23505')
            {
                throw error;
            }
        }
       }
       throw new AppError(500, 'CODE_GENERATION_FAILED', 'Could not generate a unique short code');
    });






/================================================================GET ALL CODES==========================================================================================/





router.get('/api/links', async (req,res)=>
{
    const rows = await db.any('SELECT code, original_url, clicks, created_at FROM links ORDER BY created_at DESC');
    res.status(200).json(rows.map(formatLink));
});




/================================================================GET 1 CODE STATS==========================================================================================/





router.get('/api/links/:code', async (req, res) => 
{
  const row = await db.oneOrNone('SELECT code, original_url, clicks, created_at FROM links WHERE code = $1',[req.params.code]);

  if (!row) 
  {
    throw new AppError(404, 'LINK_NOT_FOUND', 'Short link does not exist');
  }

  res.status(200).json(formatLink(row));
});





/================================================================UPDATE URL==========================================================================================/




router.patch('/api/links/:code', async(req, res)=>
{
    const {url} = req.body || {};
    const validatedUrl = validateUrl(url);

    const row = await db.oneOrNone('UPDATE links SET original_url = $1 WHERE code = $2 RETURNING code, original_url, clicks, created_at',[validatedUrl, req.params.code]);

    if(!row)
    {
        throw new AppError(404, 'LINK_NOT_FOUND', 'Short link does not exist');
    }
    res.status(200).json(formatLink(row));
});




/================================================================DELETE URL==========================================================================================/




router.delete('/api/links/:code', async (req,res)=>
{
   const row = await db.oneOrNone('DELETE FROM links WHERE code = $1 RETURNING code',[req.params.code]);
   if (!row)
   {
        throw new AppError(404, 'LINK_NOT_FOUND', 'Short link does not exist');
   }
   res.status(204).end();
});



/================================================================REDIRECT==========================================================================================/

router.get('/:code', async(req, res)=>
    {
        const row = await db.oneOrNone('UPDATE links SET clicks = clicks + 1 WHERE code = $1 RETURNING original_url',[req.params.code]);
        if (!row)
        {
            throw new AppError(404, 'LINK_NOT_FOUND', 'Short link does not exist');
        }
        res.redirect(302, row.original_url);
    });

export default router;