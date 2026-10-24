const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <style>
    .bg { fill: #09090b; stroke: #27272a; stroke-width: 1.5; }
    .glyph { fill: none; stroke: #f4f4f5; stroke-width: 3.2; stroke-linecap: round; stroke-linejoin: round; }
    @media (prefers-color-scheme: light) {
      .bg { fill: #ffffff; stroke: #e4e4e7; }
      .glyph { stroke: #09090b; }
    }
  </style>
  <rect class="bg" x="1" y="1" width="30" height="30" rx="7"/>
  <path class="glyph" d="M 20.5 11.5 C 20.5 9.2 18.5 8 16 8 C 13.5 8 11.5 9.2 11.5 12 C 11.5 14.2 13 15.2 16 16 C 19 16.8 20.5 17.8 20.5 20 C 20.5 22.8 18.5 24 16 24 C 13.5 24 11.5 22.8 11.5 20.5"/>
</svg>`;

// Static dark theme SVG for raster rendering (ICO, PNG, Apple Touch Icon)
const staticDarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect fill="#09090b" stroke="#27272a" stroke-width="1.5" x="1" y="1" width="30" height="30" rx="7"/>
  <path fill="none" stroke="#f4f4f5" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M 20.5 11.5 C 20.5 9.2 18.5 8 16 8 C 13.5 8 11.5 9.2 11.5 12 C 11.5 14.2 13 15.2 16 16 C 19 16.8 20.5 17.8 20.5 20 C 20.5 22.8 18.5 24 16 24 C 13.5 24 11.5 22.8 11.5 20.5"/>
</svg>`;

async function generate() {
  const srcDir = path.join(__dirname, '..', 'src');

  // 1. Write SVG
  fs.writeFileSync(path.join(srcDir, 'favicon.svg'), svgContent.trim());
  console.log('Created src/favicon.svg');

  // 2. Generate PNGs using Sharp
  const svgBuffer = Buffer.from(staticDarkSvg);
  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const png180 = await sharp(svgBuffer).resize(180, 180).png().toBuffer();

  fs.writeFileSync(path.join(srcDir, 'favicon-16x16.png'), png16);
  fs.writeFileSync(path.join(srcDir, 'favicon-32x32.png'), png32);
  fs.writeFileSync(path.join(srcDir, 'apple-touch-icon.png'), png180);
  console.log('Created src/favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png');

  // 3. Generate multi-resolution favicon.ico (16x16 and 32x32)
  const headerSize = 6;
  const entrySize = 16;
  const numImages = 2;
  const offset1 = headerSize + entrySize * numImages; // 38
  const offset2 = offset1 + png16.length;

  const ico = Buffer.alloc(offset2 + png32.length);

  // ICONDIR header
  ico.writeUInt16LE(0, 0); // Reserved
  ico.writeUInt16LE(1, 2); // Type 1 = Icon
  ico.writeUInt16LE(numImages, 4); // Number of images

  // Entry 1: 16x16
  ico.writeUInt8(16, 6);
  ico.writeUInt8(16, 7);
  ico.writeUInt8(0, 8); // Color count
  ico.writeUInt8(0, 9); // Reserved
  ico.writeUInt16LE(1, 10); // Color planes
  ico.writeUInt16LE(32, 12); // Bits per pixel
  ico.writeUInt32LE(png16.length, 14); // Image size
  ico.writeUInt32LE(offset1, 18); // Image offset

  // Entry 2: 32x32
  ico.writeUInt8(32, 22);
  ico.writeUInt8(32, 23);
  ico.writeUInt8(0, 24);
  ico.writeUInt8(0, 25);
  ico.writeUInt16LE(1, 26);
  ico.writeUInt16LE(32, 28);
  ico.writeUInt32LE(png32.length, 30);
  ico.writeUInt32LE(offset2, 34);

  // Write image buffers
  png16.copy(ico, offset1);
  png32.copy(ico, offset2);

  fs.writeFileSync(path.join(srcDir, 'favicon.ico'), ico);
  console.log('Created src/favicon.ico (16x16 & 32x32)');
}

generate().catch(console.error);
