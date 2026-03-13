import { pool } from '../config/db.js';

export async function createOrder({ userId, shippingAddress, items }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insert order with temporary total; we'll update after inserting items
    const { rows: orderRows } = await client.query(
      `
        INSERT INTO orders (user_id, total_amount, shipping_address, status)
        VALUES ($1, 0, $2, $3)
        RETURNING *
      `,
      [userId, shippingAddress, 'PLACED']
    );
    const order = orderRows[0];

    for (const item of items) {
      await client.query(
        `
          INSERT INTO order_items (order_id, product_id, quantity, price)
          SELECT $1, p.id, $2, p.price
          FROM products p
          WHERE p.id = $3
        `,
        [order.id, item.quantity, item.product_id]
      );
    }

    const { rows: totalRows } = await client.query(
      `
        SELECT COALESCE(SUM(quantity * price), 0)::numeric(10,2) AS total
        FROM order_items
        WHERE order_id = $1
      `,
      [order.id]
    );

    const total = totalRows[0]?.total ?? 0;

    const { rows: updatedOrderRows } = await client.query(
      `
        UPDATE orders
        SET total_amount = $2
        WHERE id = $1
        RETURNING *
      `,
      [order.id, total]
    );

    await client.query('COMMIT');
    return updatedOrderRows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getOrderById(id) {
  const { rows: orderRows } = await pool.query(
    `
      SELECT
        o.id,
        o.user_id,
        o.total_amount,
        o.shipping_address,
        o.status,
        o.created_at
      FROM orders o
      WHERE o.id = $1
    `,
    [id]
  );

  const order = orderRows[0];
  if (!order) return null;

  const { rows: itemRows } = await pool.query(
    `
      SELECT
        oi.id,
        oi.product_id,
        oi.quantity,
        oi.price,
        p.name,
        p.description
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = $1
      ORDER BY oi.id
    `,
    [id]
  );

  return { ...order, items: itemRows };
}

