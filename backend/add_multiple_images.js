import { pool } from './config/db.js';

async function addMultipleImages() {
  try {
    console.log("Adding additional images to the database...");
    await pool.query(`
      INSERT INTO product_images (product_id, image_url, is_primary)
      SELECT
        id,
        'https://source.unsplash.com/400x400/?' || REPLACE(name, ' ', '%20') || '&sig=2',
        FALSE
      FROM products;
      
      INSERT INTO product_images (product_id, image_url, is_primary)
      SELECT
        id,
        'https://source.unsplash.com/400x400/?' || REPLACE(name, ' ', '%20') || '&sig=3',
        FALSE
      FROM products;
      
      INSERT INTO product_images (product_id, image_url, is_primary)
      SELECT
        id,
        'https://source.unsplash.com/400x400/?' || REPLACE(name, ' ', '%20') || '&sig=4',
        FALSE
      FROM products;
    `);
    console.log("Multiple images added successfully to each product!");
  } catch (err) {
    console.error("Failed to add images:", err);
  } finally {
    process.exit();
  }
}

addMultipleImages();
