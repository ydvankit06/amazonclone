import fs from 'fs';
import path from 'path';
import https from 'https';
import { pool } from './config/db.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Map of exact high-quality images for each product
const exactImages = {
  'Wireless Over-Ear Headphones': 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=800&q=80',
  'Noise Cancelling Earbuds': 'https://images.unsplash.com/photo-1585386959984-a4155223f3f8?auto=format&fit=crop&w=800&q=80',
  '4K UHD Monitor 27-inch': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
  'Mechanical Gaming Keyboard': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
  'Wireless Gaming Mouse': 'https://images.unsplash.com/photo-1584270354949-c26b0c4df157?auto=format&fit=crop&w=800&q=80',
  'USB-C Fast Charger 65W': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  'Portable Bluetooth Speaker': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
  'External SSD 1TB': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
  'Smartwatch with AMOLED Display': 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80',
  'Wi-Fi 6 Router': 'https://images.unsplash.com/photo-1580894906475-403276d3942c?auto=format&fit=crop&w=800&q=80',

  'Men\'s Slim Fit Jeans': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
  'Men\'s Cotton T-Shirt': 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80',
  'Women\'s Maxi Dress': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
  'Women\'s Sports Leggings': 'https://images.unsplash.com/photo-1526402461234-4f3e646cd4c3?auto=format&fit=crop&w=800&q=80',
  'Unisex Hoodie': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
  'Men\'s Formal Shirt': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
  'Women\'s Denim Jacket': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
  'Athletic Running Shorts': 'https://images.unsplash.com/photo-1526402461234-4f3e646cd4c3?auto=format&fit=crop&w=800&q=80',
  'Winter Beanie Cap': 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa4?auto=format&fit=crop&w=800&q=80',
  'Men\'s Leather Belt': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',

  'Clean Code': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
  'The Pragmatic Programmer': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
  'Atomic Habits': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
  'Deep Work': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
  'Sapiens': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',

  'Memory Foam Pillow': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  'Stainless Steel Water Bottle': 'https://images.unsplash.com/photo-1526403227209-97787a34c342?auto=format&fit=crop&w=800&q=80',
  'Non-Stick Cookware Set': 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=800&q=80',
  'Bamboo Cutting Board': 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=800&q=80',
  'Cotton Bedsheet Set': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  'LED Desk Lamp': 'https://images.unsplash.com/photo-1523473827532-86c5ea9c801b?auto=format&fit=crop&w=800&q=80',
  'Laundry Storage Basket': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'
};

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      // Follow redirects
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
        return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      }
      
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }

      const file = fs.createWriteStream(filepath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
      file.on('error', (err) => {
        fs.unlink(filepath, () => reject(err));
      });
    }).on('error', reject);
  });
}

function generateSvgPlaceholder(text, filepath) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="100%" height="100%" fill="#f1f5f9"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#475569" font-weight="bold">${text.replace(/&/g, '&amp;')}</text>
  </svg>`;
  fs.writeFileSync(filepath, svg);
  return filepath;
}

async function fixImages() {
  try {
    console.log("Starting high-quality image fix...");
    
    // Fetch all products
    const { rows: products } = await pool.query(`SELECT id, name FROM products`);

    // Let's clear out the old product_images entries to start fresh with 4 high quality images each
    await pool.query(`DELETE FROM product_images`);
    console.log("Cleared old low-quality placeholder images.");

    for (const p of products) {
      console.log(`Processing exact images for "${p.name}"...`);
      const exactUrl = exactImages[p.name];
      
      // We will generate 4 images for each product. 
      // Main image: Exact high quality match
      // Other 3: SVGs or exact matches with slightly different parameters
      
      for (let i = 1; i <= 4; i++) {
         const suffix = i === 1 ? '-main' : `-${i}`;
         const isPrimary = i === 1;
         const filename = `product-${p.id}${suffix}.jpg`;
         const svgFilename = `product-${p.id}${suffix}.svg`;
         const filepath = path.join(uploadsDir, filename);
         const svgFilepath = path.join(uploadsDir, svgFilename);
         let publicUrl;

         try {
           if (exactUrl) {
               // Add a random parameter to get slightly different variants of the same photo if possible, or just the same photo
               const fetchUrl = exactUrl + (i > 1 ? `&sig=${i}` : ''); 
               await downloadImage(fetchUrl, filepath);
               publicUrl = `/uploads/${filename}`;
           } else {
               throw new Error("No exact URL mapped");
           }
         } catch (err) {
             console.log(` -> Failed to fetch ${p.name} image ${i}: ${err.message}. Falling back to SVG.`);
             generateSvgPlaceholder(`${p.name} (View ${i})`, svgFilepath);
             publicUrl = `/uploads/${svgFilename}`;
         }

         await pool.query(
            `INSERT INTO product_images (product_id, image_url, is_primary) VALUES ($1, $2, $3)`,
            [p.id, publicUrl, isPrimary]
         );
      }
    }

    console.log("High-quality image fix complete!");
  } catch (err) {
    console.error("Fix failed:", err);
  } finally {
    process.exit();
  }
}

fixImages();
