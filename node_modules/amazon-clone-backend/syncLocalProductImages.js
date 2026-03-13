import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');

function getLocalImageUrls(productId) {
  const variants = ['exact.jpg', 'main.jpg', '2.jpg', '3.jpg', '4.jpg'];

  return variants
    .map((variant) => ({
      file: `product-${productId}-${variant}`,
      url: `/uploads/product-${productId}-${variant}`
    }))
    .filter(({ file }) => fs.existsSync(path.join(uploadsDir, file)))
    .map(({ url }) => url);
}

async function syncLocalProductImages() {
  const client = await pool.connect();

  try {
    const { rows: products } = await client.query(
      'SELECT id, name FROM products ORDER BY id'
    );

    for (const product of products) {
      const imageUrls = getLocalImageUrls(product.id);

      if (imageUrls.length === 0) {
        console.warn(`No local JPG images found for "${product.name}"`);
        continue;
      }

      await client.query('BEGIN');
      await client.query('DELETE FROM product_images WHERE product_id = $1', [
        product.id
      ]);

      for (const [index, imageUrl] of imageUrls.entries()) {
        await client.query(
          `INSERT INTO product_images (product_id, image_url, is_primary)
           VALUES ($1, $2, $3)`,
          [product.id, imageUrl, index === 0]
        );
      }

      await client.query('COMMIT');
      console.log(
        `Synced "${product.name}" to ${imageUrls.length} local image(s).`
      );
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to sync local product images:', error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

syncLocalProductImages();
