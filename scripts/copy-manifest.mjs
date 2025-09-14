import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Since this is an ES module, __dirname is not available.
// We can derive it from import.meta.url.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const source = path.resolve(__dirname, '..', 'manifest.json');
const destinationDir = path.resolve(__dirname, '..', 'dist');
const destinationFile = path.resolve(destinationDir, 'manifest.json');

(async () => {
  try {
    // Vite should create the 'dist' directory, but we ensure it exists just in case.
    await fs.mkdir(destinationDir, { recursive: true });
    await fs.copyFile(source, destinationFile);
    console.log(`Successfully copied manifest.json to ${destinationFile}`);
  } catch (err) {
    console.error(`Error copying manifest.json: ${err}`);
    process.exit(1);
  }
})();
