import '../envLoader.js';
import upath from 'upath';
import { fileURLToPath } from 'url';

// Convert URL to file path
const thisFileName = fileURLToPath(import.meta.url);
const SERVER_DIR = upath.dirname(thisFileName);
const PROJECT_DIR = upath.join(SERVER_DIR, '../');

// static routes
const PUBLIC_DIR = upath.join(SERVER_DIR, '/public/'); 
const VIEW_DIR = upath.join(SERVER_DIR, '/views/'); 
const STATIC_CLIENT_DIR = upath.join(PROJECT_DIR, '/Client/'); 

const AGREED_PUBLIC_ROUTE_NAME = 'source'; 

const env = process.env;
export {
  SERVER_DIR,
  PROJECT_DIR,
  VIEW_DIR,
  STATIC_CLIENT_DIR,
  PUBLIC_DIR,
  AGREED_PUBLIC_ROUTE_NAME,
  env
};