import {
  getCartItemsByUser,
  addCartItem,
  updateCartItem,
  removeCartItem
} from '../models/cartModel.js';

function getUserId(req) {
  const headerId = req.header('x-user-id');
  const queryId = req.query.userId;
  return Number(headerId || queryId || 1);
}

export async function getCart(req, res, next) {
  try {
    const userId = getUserId(req);
    const items = await getCartItemsByUser(userId);
    res.json({ user_id: userId, items });
  } catch (err) {
    next(err);
  }
}

export async function addItemToCart(req, res, next) {
  try {
    const userId = getUserId(req);
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ message: 'product_id is required' });
    }
    if (quantity <= 0) {
      return res.status(400).json({ message: 'quantity must be greater than 0' });
    }

    const item = await addCartItem(userId, product_id, quantity);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function updateCartItemQuantity(req, res, next) {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'quantity must be greater than 0' });
    }

    const updated = await updateCartItem(id, quantity);
    if (!updated) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteCartItem(req, res, next) {
  try {
    const { id } = req.params;
    const removed = await removeCartItem(id);
    if (!removed) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

