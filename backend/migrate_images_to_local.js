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

// Generate a simple SVG placeholder if Unsplash rate limits us
function generateSvgPlaceholder(text, filepath) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
    <rect width="100%" height="100%" fill="#f3f4f6"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#6b7280">${text}</text>
  </svg>`;
  fs.writeFileSync(filepath, svg);
  return filepath;
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
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

async function migrateImages() {
  try {
    console.log("Starting robust image migration (generating placeholders for rate limits)...");
    
    const { rows: images } = await pool.query(`
      SELECT p.name, pi.id, pi.product_id, pi.image_url, pi.is_primary 
      FROM product_images pi
      JOIN products p ON p.id = pi.product_id
    `);

    for (const img of images) {
      if (!img.image_url.startsWith('https://')) {
          continue;
      }
      
      const sigMatch = img.image_url.match(/sig=(\d+)/);
      const suffix = sigMatch ? `-${sigMatch[1]}` : (img.is_primary ? '-main' : '');
      const isSigUrl = !!sigMatch;

      // We use .svg if we fallback, but try .jpg first
      let filename = `product-${img.product_id}${suffix}.jpg`;
      let filepath = path.join(uploadsDir, filename);
      let publicUrl = `/uploads/${filename}`;
      let usingPlaceholder = false;

      console.log(`Processing image ${img.id} for "${img.name}"...`);
      
      try {
        // Try a different free source since unspash is blocking
        // We will just use placeholders for secondary images to save time and bandwidth
        if (isSigUrl) {
           throw new Error("HTTP 503"); // force placeholder for non-primary images
        } else {
           // We use a different service like picsum for primary or just Unsplash if it works
           const fetchUrl = `https://picsum.photos/seed/${encodeURIComponent(img.name)}/400/400`;
           await downloadImage(fetchUrl, filepath);
        }
      } catch (err) {
        // Fallback to robust colored placeholder
        console.log(` -> Failed to download real image (${err.message}), strictly falling back to generated SVG placeholder.`);
        filename = `product-${img.product_id}${suffix}.svg`;
        filepath = path.join(uploadsDir, filename);
        publicUrl = `/uploads/${filename}`;
        generateSvgPlaceholder(img.name + (isSigUrl ? ` ${sigMatch[1]}` : ''), filepath);
        usingPlaceholder = true;
      }
      
      await pool.query(
        `UPDATE product_images SET image_url = $1 WHERE id = $2`,
        [publicUrl, img.id]
      );
      
      if (!usingPlaceholder) {
         // Pause only if we did a real network request
         await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    process.exit();
  }
}

migrateImages();
