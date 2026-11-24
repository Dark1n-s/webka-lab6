import 'dotenv/config';
import express from 'express';
import db from './db.js';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';

const app = express();
const port = Number(process.env.port) || 8080;

const openApiPath = fileURLToPath(new URL('../openapi.yaml', import.meta.url));
const openApiFile = fs.readFileSync(openApiPath, 'utf-8');
const swaggerDocument = YAML.parse(openApiFile)

app.use(express.json())

app.get('/health', async (req, res) =>
{
    try
    {
        await db.one('SELECT 1 AS ok')
        res.status(200).json({status:'ok', database: 'connected'});
    }
    catch(error)
    {
        res.status(503).json({status:'error', database: 'disconnected'});
    }
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, ()=>
{
    console.log("ss")
});