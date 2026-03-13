import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

function getSeedImageUrls(productId) {
  const variants = ['exact.jpg', 'main.jpg', '2.jpg', '3.jpg', '4.jpg'];

  return variants
    .map((variant) => ({
      file: `product-${productId}-${variant}`,
      url: `/uploads/product-${productId}-${variant}`
    }))
    .filter(({ file }) => fs.existsSync(path.join(uploadsDir, file)))
    .map(({ url }) => url);
}

export async function seedExampleData() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price NUMERIC(10, 2) NOT NULL,
      category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
      stock INTEGER NOT NULL DEFAULT 0,
      rating NUMERIC(2, 1) NOT NULL DEFAULT 4.5,
      review_count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      is_primary BOOLEAN NOT NULL DEFAULT FALSE
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
      quantity INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
      shipping_address TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL REFERENCES products(id),
      quantity INTEGER NOT NULL,
      price NUMERIC(10, 2) NOT NULL
    );
  `);

  // Seed categories
  await pool.query(
    `
    INSERT INTO categories (name, slug)
    VALUES
      ('Electronics', 'electronics'),
      ('Clothing', 'clothing'),
      ('Books', 'books'),
      ('Home', 'home')
    ON CONFLICT (slug) DO NOTHING;
  `
  );

  const { rows } = await pool.query('SELECT COUNT(*) FROM products');
  if (Number(rows[0].count) === 0) {
    await pool.query(
      `
      INSERT INTO products (name, description, price, category_id, stock, rating, review_count)
      VALUES
        ('Wireless Over-Ear Headphones', 'Bluetooth over-ear headphones with 30 hours battery life and deep bass.', 2999.00, 1, 120, 4.6, 528),
        ('Noise Cancelling Earbuds', 'In-ear true wireless earbuds with active noise cancellation and fast charging.', 4499.00, 1, 80, 4.4, 312),
        ('4K UHD Monitor 27-inch', '27-inch 4K UHD IPS monitor with HDR and slim bezels.', 18999.00, 1, 35, 4.7, 210),
        ('Mechanical Gaming Keyboard', 'RGB mechanical keyboard with blue switches and compact layout.', 3499.00, 1, 60, 4.5, 742),
        ('Wireless Gaming Mouse', 'Ergonomic wireless mouse with adjustable DPI and RGB lighting.', 1999.00, 1, 150, 4.3, 388),
        ('USB-C Fast Charger 65W', 'Multi-port USB-C fast charger suitable for laptops and phones.', 2499.00, 1, 200, 4.6, 156),
        ('Portable Bluetooth Speaker', 'Water-resistant portable speaker with 12 hours of playtime.', 1599.00, 1, 95, 4.2, 274),
        ('External SSD 1TB', 'High-speed 1TB USB-C external SSD for backups and travel.', 7999.00, 1, 40, 4.8, 193),
        ('Smartwatch with AMOLED Display', 'Fitness tracking smartwatch with heart rate and GPS.', 6999.00, 1, 55, 4.1, 417),
        ('Wi-Fi 6 Router', 'Dual-band Wi-Fi 6 router with MU-MIMO and OFDMA.', 5499.00, 1, 30, 4.4, 89),

        ('Men''s Slim Fit Jeans', 'Dark blue slim fit stretch denim jeans.', 1299.00, 2, 200, 4.3, 621),
        ('Men''s Cotton T-Shirt', '100% cotton crew neck t-shirt (pack of 2).', 799.00, 2, 350, 4.2, 412),
        ('Women''s Maxi Dress', 'Floral printed ankle-length maxi dress.', 1799.00, 2, 120, 4.5, 278),
        ('Women''s Sports Leggings', 'High-waisted stretch leggings for workouts.', 999.00, 2, 260, 4.4, 331),
        ('Unisex Hoodie', 'Fleece-lined hoodie with front pockets and drawstring.', 1499.00, 2, 180, 4.6, 195),
        ('Men''s Formal Shirt', 'Slim fit formal shirt for office wear.', 1199.00, 2, 140, 4.1, 167),
        ('Women''s Denim Jacket', 'Classic light-wash denim jacket.', 2299.00, 2, 80, 4.7, 143),
        ('Athletic Running Shorts', 'Lightweight running shorts with inner lining.', 699.00, 2, 220, 4.0, 98),
        ('Winter Beanie Cap', 'Knitted wool beanie for cold weather.', 499.00, 2, 300, 4.4, 75),
        ('Men''s Leather Belt', 'Genuine leather reversible belt with metal buckle.', 899.00, 2, 160, 4.5, 289),

        ('Clean Code', 'A Handbook of Agile Software Craftsmanship by Robert C. Martin.', 799.00, 3, 90, 4.8, 2153),
        ('The Pragmatic Programmer', 'Your Journey to Mastery, 20th Anniversary Edition.', 899.00, 3, 70, 4.7, 1421),
        ('Atomic Habits', 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.', 599.00, 3, 150, 4.6, 5321),
        ('Deep Work', 'Rules for Focused Success in a Distracted World.', 549.00, 3, 110, 4.4, 1732),
        ('Sapiens', 'A Brief History of Humankind by Yuval Noah Harari.', 699.00, 3, 80, 4.5, 2019),

        ('Memory Foam Pillow', 'Ergonomic memory foam pillow for neck support.', 1299.00, 4, 130, 4.3, 457),
        ('Stainless Steel Water Bottle', 'Insulated bottle keeps drinks hot or cold for hours.', 799.00, 4, 210, 4.6, 512),
        ('Non-Stick Cookware Set', '5-piece non-stick cookware set with lids.', 2499.00, 4, 60, 4.2, 189),
        ('Bamboo Cutting Board', 'Large bamboo cutting board with juice groove.', 899.00, 4, 140, 4.5, 311),
        ('Cotton Bedsheet Set', 'King size bedsheet with two pillow covers.', 1599.00, 4, 95, 4.1, 278),
        ('LED Desk Lamp', 'Adjustable LED desk lamp with touch controls.', 1199.00, 4, 70, 4.4, 164),
        ('Laundry Storage Basket', 'Foldable fabric laundry basket with handles.', 699.00, 4, 180, 4.2, 96)
      ;
    `
    );

    const { rows: seededProducts } = await pool.query(
      'SELECT id FROM products ORDER BY id'
    );

    for (const product of seededProducts) {
      const imageUrls = getSeedImageUrls(product.id);

      for (const [index, imageUrl] of imageUrls.entries()) {
        await pool.query(
          `INSERT INTO product_images (product_id, image_url, is_primary)
           VALUES ($1, $2, $3)`,
          [product.id, imageUrl, index === 0]
        );
      }
    }
  }
}

