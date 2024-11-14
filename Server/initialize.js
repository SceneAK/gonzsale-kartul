import upath from 'upath';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Convert URL to file path
const thisFileName = fileURLToPath(import.meta.url);
const __dirname = upath.dirname(thisFileName);

// static routes
const PUBLIC_DIR = upath.join(__dirname, '/public/'); 
const STATIC_ROUTE_NAME = 'source';

// load .env file to process.env
dotenv.config();

export {
  __dirname,
  STATIC_ROUTE_NAME,
  PUBLIC_DIR
};