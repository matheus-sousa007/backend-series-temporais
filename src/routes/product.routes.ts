import { Router } from 'express'; 

import {
    createProduct,
    getProducts,
    getProductById,
    updateProductById,
    teste
} from '../controllers/product.controller';

const router = Router();

router.post('/products', createProduct)
router.get('/products', getProducts)
router.get('/products/:id', getProductById)
router.put('/products/:id', updateProductById)
router.get("/teste", teste)

export default router;