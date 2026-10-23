const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '..', 'src', 'assets', 'images');
const SUPPORTED_EXTS = new Set(['.jpg', '.jpeg', '.png']);

/**
 * Recursively find all supported raster image files in a directory.
 */
function findImages(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findImages(fullPath, fileList);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTS.has(ext)) {
        // Skip -original files if desired, but we can process everything
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

/**
 * Optimizes an image: converts to WebP and compresses the original if needed.
 */
async function processImage(filePath) {
  const ext = path.extname(filePath);
  const webpPath = filePath.slice(0, -ext.length) + '.webp';
  const fileStat = fs.statSync(filePath);
  const relativeSrc = path.relative(IMAGES_DIR, filePath);

  let webpCreated = false;

  // Check if webp needs to be generated (missing or source is newer)
  if (!fs.existsSync(webpPath) || fs.statSync(webpPath).mtimeMs < fileStat.mtimeMs) {
    try {
      const image = sharp(filePath);
      const metadata = await image.metadata();

      let pipeline = sharp(filePath);
      // Cap maximum dimensions at 1920px for web performance without enlarging smaller assets
      if (metadata.width && metadata.width > 1920) {
        pipeline = pipeline.resize({ width: 1920, withoutEnlargement: true });
      }

      await pipeline
        .webp({ quality: 82, effort: 5 })
        .toFile(webpPath);

      const webpStat = fs.statSync(webpPath);
      const savings = (((fileStat.size - webpStat.size) / fileStat.size) * 100).toFixed(1);
      console.log(
        `[optimize-images] Converted: ${relativeSrc} -> .webp (${(fileStat.size / 1024).toFixed(1)} KB -> ${(webpStat.size / 1024).toFixed(1)} KB, -${savings}%)`
      );
      webpCreated = true;
    } catch (err) {
      console.error(`[optimize-images] Failed to convert ${relativeSrc} to WebP:`, err.message);
    }
  }

  return webpCreated;
}

/**
 * Scans src/assets/images and generates compressed WebP versions of all images.
 */
async function optimizeImages() {
  const images = findImages(IMAGES_DIR);
  if (images.length === 0) {
    return;
  }

  let convertedCount = 0;
  for (const imgPath of images) {
    const converted = await processImage(imgPath);
    if (converted) convertedCount++;
  }

  if (convertedCount > 0) {
    console.log(`[optimize-images] Successfully generated ${convertedCount} WebP images.`);
  }
}

if (require.main === module) {
  optimizeImages()
    .then(() => {
      console.log('[optimize-images] Image optimization process complete.');
    })
    .catch((err) => {
      console.error('[optimize-images] Fatal error:', err);
      process.exit(1);
    });
}

module.exports = { optimizeImages };
