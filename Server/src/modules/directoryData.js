import upath from 'upath';
import { fileURLToPath } from 'url';

// Convert URL to file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = upath.dirname(__filename);

// static routes
const PUBLIC_DIR = upath.join(__dirname, '/public/');
const STATIC_ROUTE_NAME = 'source';

export {
  __dirname,
  __filename,
  STATIC_ROUTE_NAME,
  PUBLIC_DIR
};