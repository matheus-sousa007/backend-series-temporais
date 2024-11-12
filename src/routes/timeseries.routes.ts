import { Router } from 'express';

import {
    getTimeSeriesById
} from '../controllers/timeseries.controller'


const router = Router();

router.get('/time-series/:id', getTimeSeriesById);

export default router;