import { Router } from 'express';
import { placeOrder, getOrder } from '../controllers/orderController.js';

const router = Router();

// /api/orders
router.post('/', placeOrder);

// /api/orders/:id
router.get('/:id', getOrder);

export default router;

