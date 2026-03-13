import { Router } from 'express';
import {
  getCart,
  addItemToCart,
  updateCartItemQuantity,
  deleteCartItem
} from '../controllers/cartController.js';

const router = Router();

// /api/cart
router.get('/', getCart);
router.post('/', addItemToCart);

// /api/cart/:id
router.put('/:id', updateCartItemQuantity);
router.delete('/:id', deleteCartItem);

export default router;

