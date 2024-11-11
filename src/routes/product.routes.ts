import { Router } from 'express'; 

import {
    createProduct,
    getProducts,
    getProductById,
    updateProductById
} from '../controllers/product.controller';

const router = Router();

router.post('/products', createProduct)
router.get('/products', getProducts)
router.get('/products/:id', getProductById)
router.put('/products/:id', updateProductById)

export default router;