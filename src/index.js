import 'dotenv/config';
import express from 'express';
import db from './db.js';

const app = express();
const port = Number(process.env.port) || 8080;

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

app.listen(port, ()=>
{
    console.log("ss")
});