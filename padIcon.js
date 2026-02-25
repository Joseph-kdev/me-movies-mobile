const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function padImage() {
    const iconPath = path.join(__dirname, 'assets', 'images', 'Me-Movies.png');
    const backupPath = path.join(__dirname, 'assets', 'images', 'Me-Movies-backup.png');

    // Backup original
    if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(iconPath, backupPath);
    }

    // Determine size
    const metadata = await sharp(backupPath).metadata();
    const width = metadata.width;
    const height = metadata.height;

    // We want the logo to be about 66% of the final size to fit perfectly inside the adaptive icon safe zone
    // We'll scale down the original image to 66% of its size, then paste it back onto an original-sized canvas
    const scaledWidth = Math.round(width * 0.66);
    const scaledHeight = Math.round(height * 0.66);

    await sharp(backupPath)
        .resize(scaledWidth, scaledHeight)
        .extend({
            top: Math.floor((height - scaledHeight) / 2),
            bottom: Math.ceil((height - scaledHeight) / 2),
            left: Math.floor((width - scaledWidth) / 2),
            right: Math.ceil((width - scaledWidth) / 2),
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toFile(iconPath);

    console.log("Successfully added padding to Me-Movies.png");
}

padImage().catch(console.error);
