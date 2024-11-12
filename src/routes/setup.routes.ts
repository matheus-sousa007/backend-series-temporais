import { Router } from 'express';

import {
    createSetup,
    resetSetup,
    getMetadata,
    getMetadataById,
    checkIfTableExists
} from '../controllers/setup.controller'

const router = Router();

router.get('/setup', createSetup);
router.delete('/setup', resetSetup);
router.get('/metadata', getMetadata);
router.get('/metadata/:id', getMetadataById);
router.get('/schema/:tablename', checkIfTableExists)

export default router;