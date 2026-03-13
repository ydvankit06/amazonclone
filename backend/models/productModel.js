import { pool } from '../config/db.js';

export async function getProducts({ page = 1, limit = 12, categoryId }) {
  const pageNumber = Number(page) || 1;
  const pageSize = Math.min(Number(limit) || 12, 100);
  const offset = (pageNumber - 1) * pageSize;

  const values = [];
  let whereClause = '';

  if (categoryId) {
    values.push(categoryId);
    whereClause = `WHERE category_id = $${values.length}`;
  }

  const countQuery = `SELECT COUNT(*)::int AS total FROM products ${whereClause}`;
  const { rows: countRows } = await pool.query(countQuery, values);
  const total = countRows[0]?.total ?? 0;

  const dataQuery = `
    SELECT
      p.id,
      p.name,
      p.description,
      p.price,
      p.category_id,
      p.stock,
      p.rating,
      p.review_count,
      p.created_at,
      (
        SELECT image_url
        FROM product_images pi
        WHERE pi.product_id = p.id AND pi.is_primary = TRUE
        ORDER BY pi.id
        LIMIT 1
      ) AS image_url
    FROM products p
    ${whereClause}
    ORDER BY p.created_at DESC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

  const { rows } = await pool.query(dataQuery, [...values, pageSize, offset]);

  return {
    items: rows,
    total,
    page: pageNumber,
    limit: pageSize,
    totalPages: Math.ceil(total / pageSize) || 1
  };
}

export async function getProductByIdWithImages(id) {
  const productQuery = `
    SELECT
      p.*,
      COALESCE(
        (
          SELECT json_agg(json_build_object('id', pi.id, 'image_url', pi.image_url, 'is_primary', pi.is_primary)
                          ORDER BY pi.is_primary DESC, pi.id)
          FROM product_images pi
          WHERE pi.product_id = p.id
        ),
        '[]'
      ) AS images
    FROM products p
    WHERE p.id = $1
  `;

  const { rows } = await pool.query(productQuery, [id]);
  return rows[0] ?? null;
}

export async function searchProductsByName(query) {
  if (!query) return [];

  const search = `%${query}%`;
  const { rows } = await pool.query(
    `
      SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.category_id,
        p.stock,
        p.rating,
        p.review_count,
        p.created_at,
        (
          SELECT image_url
          FROM product_images pi
          WHERE pi.product_id = p.id AND pi.is_primary = TRUE
          ORDER BY pi.id
          LIMIT 1
        ) AS image_url
      FROM products p
      WHERE p.name ILIKE $1
      ORDER BY p.created_at DESC
      LIMIT 50
    `,
    [search]
  );

  return rows;
}

