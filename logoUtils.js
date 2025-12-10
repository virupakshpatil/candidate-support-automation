import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load logo image and convert to base64 data URI
 * @param {string} logoPath Path to logo file (relative to project root or absolute)
 * @returns {string} Base64 data URI or empty string if file not found
 */
export function loadLogoAsBase64(logoPath = null) {
  try {
    // Try multiple possible locations
    const possiblePaths = [
      logoPath,
      path.join(__dirname, 'logo.png'),
      path.join(__dirname, 'logo.jpg'),
      path.join(__dirname, 'assets', 'logo.png'),
      path.join(__dirname, 'assets', 'logo.jpg'),
    ].filter(Boolean);

    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        const imageBuffer = fs.readFileSync(filePath);
        const base64Image = imageBuffer.toString('base64');
        
        // Determine MIME type from file extension
        const ext = path.extname(filePath).toLowerCase();
        let mimeType = 'image/png';
        if (ext === '.jpg' || ext === '.jpeg') {
          mimeType = 'image/jpeg';
        } else if (ext === '.gif') {
          mimeType = 'image/gif';
        } else if (ext === '.svg') {
          mimeType = 'image/svg+xml';
        }
        
        return `data:${mimeType};base64,${base64Image}`;
      }
    }
    
    console.warn('⚠️  Logo file not found. Image will not be displayed.');
    console.warn('   Place your logo file as "logo.png" or "logo.jpg" in the project root,');
    console.warn('   or set OTOMEYT_LOGO_BASE64 in your .env file with the base64 string.');
    return '';
  } catch (error) {
    console.error('Error loading logo:', error.message);
    return '';
  }
}

/**
 * Get logo - either from base64 env variable, file, or URL
 * @returns {string} Logo data URI or URL
 */
export function getLogo() {
  // First, try base64 from environment variable
  if (process.env.OTOMEYT_LOGO_BASE64) {
    // Check if it already includes data: prefix
    if (process.env.OTOMEYT_LOGO_BASE64.startsWith('data:')) {
      return process.env.OTOMEYT_LOGO_BASE64;
    }
    // Otherwise, assume it's PNG and add prefix
    return `data:image/png;base64,${process.env.OTOMEYT_LOGO_BASE64}`;
  }
  
  // Second, try loading from file
  const base64Logo = loadLogoAsBase64();
  if (base64Logo) {
    return base64Logo;
  }
  
  // Finally, fall back to URL (less reliable in emails)
  return process.env.OTOMEYT_LOGO_URL || 'https://www.otomeyt.ai/logo.png';
}

