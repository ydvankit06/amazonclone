import { Router } from 'express';
import {
  listProducts,
  getProduct,
  searchProducts
} from '../controllers/productController.js';

const router = Router();

// /api/products
router.get('/', listProducts);

// /api/products/search?q=
router.get('/search', searchProducts);

// /api/products/:id
router.get('/:id', getProduct);

export default router;

