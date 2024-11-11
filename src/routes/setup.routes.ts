import { Router } from 'express';

import {
    createSetup,
    resetSetup,
    getMetadata
} from '../controllers/setup.controller'

const router = Router();

router.post('/setup', createSetup);
router.delete('/setup', resetSetup);
router.get('/metadata', getMetadata);

export default router;