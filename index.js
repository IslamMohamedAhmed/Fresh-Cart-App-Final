import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDb } from './Database/dbConnection.js';
import { useRoutes } from './src/Modules/useRoutes.js';
const app = express()
const port = 3000
dotenv.config();
app.use(json());
app.use(cors());
connectDb();
useRoutes(app);
process.on('unhandledRejection', (err) => {
    console.log(err);
});
app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`));