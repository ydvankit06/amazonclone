import { createOrder, getOrderById } from '../models/orderModel.js';
import { sendOrderConfirmationEmail } from '../services/orderEmailService.js';

function getUserId(req) {
  const headerId = req.header('x-user-id');
  const bodyId = req.body.user_id;
  return Number(headerId || bodyId || 1);
}

export async function placeOrder(req, res, next) {
  try {
    const userId = getUserId(req);
    const { shipping_address, items } = req.body;

    if (!shipping_address || !Array.isArray(items) || !items.length) {
      return res
        .status(400)
        .json({ message: 'shipping_address and items are required' });
    }

    const order = await createOrder({
      userId,
      shippingAddress: shipping_address,
      items
    });

    const orderDetails = await getOrderById(order.id);
    if (orderDetails) {
      try {
        await sendOrderConfirmationEmail(orderDetails);
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
      }
    }

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

export async function getOrder(req, res, next) {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
}

