import cors from 'cors';
import express from 'express';
import {router as index} from './routes/index';
import productRoute from './routes/product.routes';
import setupRoute from './routes/setup.routes';
// import TimeSeriesSetupRoute from './routes/setup.routes';
import './config/database';


export const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json'}));
app.use(cors());

app.use(index);
app.use('/', productRoute);
app.use('/', setupRoute);