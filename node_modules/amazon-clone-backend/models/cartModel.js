import { pool } from '../config/db.js';

export async function getCartItemsByUser(userId) {
  const { rows } = await pool.query(
    `
      SELECT
        ci.id,
        ci.user_id,
        ci.product_id,
        ci.quantity,
        p.name,
        p.price,
        (
          SELECT image_url
          FROM product_images pi
          WHERE pi.product_id = p.id AND pi.is_primary = TRUE
          ORDER BY pi.id
          LIMIT 1
        ) AS image_url
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.user_id = $1
      ORDER BY ci.id
    `,
    [userId]
  );
  return rows;
}

export async function addCartItem(userId, productId, quantity) {
  const { rows } = await pool.query(
    `
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
      RETURNING *
    `,
    [userId, productId, quantity]
  );
  return rows[0];
}

export async function updateCartItem(id, quantity) {
  const { rows } = await pool.query(
    `
      UPDATE cart_items
      SET quantity = $2
      WHERE id = $1
      RETURNING *
    `,
    [id, quantity]
  );
  return rows[0] ?? null;
}

export async function removeCartItem(id) {
  const { rows } = await pool.query(
    `
      DELETE FROM cart_items
      WHERE id = $1
      RETURNING *
    `,
    [id]
  );
  return rows[0] ?? null;
}

