import '../envLoader.js';
import upath from 'upath';
import { fileURLToPath } from 'url';

const env = process.env;

// Convert URL to file path
const thisFileName = fileURLToPath(import.meta.url);
const SERVER_DIR = upath.dirname(thisFileName);
const PROJECT_DIR = upath.join(SERVER_DIR, '../');

// static routes
const VIEW_DIR = upath.join(SERVER_DIR, '/views/'); 
const STATIC_CLIENT_DIR = upath.join(PROJECT_DIR, '/Client/'); 

const PUBLIC_LOCAL_STORAGE_DIR = upath.resolve("./Server/public");
const PUBLIC_LOCAL_STORAGE_ROUTE = 'source';

export {
  SERVER_DIR,
  PROJECT_DIR,
  VIEW_DIR,
  STATIC_CLIENT_DIR,
  PUBLIC_LOCAL_STORAGE_ROUTE,
  PUBLIC_LOCAL_STORAGE_DIR,
  env
};