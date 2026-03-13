import { pool } from './config/db.js';

async function updateImages() {
  try {
    await pool.query(`
      UPDATE product_images
      SET image_url = 'https://source.unsplash.com/400x400/?' || REPLACE(products.name, ' ', '%20')
      FROM products
      WHERE product_images.product_id = products.id;
    `);
    console.log("Images updated successfully based on product name/id!");
  } catch (err) {
    console.error("Failed to update images:", err);
  } finally {
    process.exit();
  }
}

updateImages();
