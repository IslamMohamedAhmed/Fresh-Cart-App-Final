import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDb } from './Database/dbConnection.js';
import { useRoutes } from './src/Modules/useRoutes.js';
const app = express()
const port = 3000
dotenv.config();
app.use(express.json());
app.use(cors());
// URL-encoded parser مع extended:true
app.use(express.urlencoded({ extended: true }));
// أو لو عايز globally لكل query params
app.set('query parser', 'extended');
connectDb();
useRoutes(app);
process.on('unhandledRejection', (err) => {
	console.log(err);
});
app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`));