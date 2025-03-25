import fs from 'fs';
import upath from 'upath';
import { env, STATIC_CLIENT_DIR } from './initialize.js';

export function initClientConfig(){
    const clientConfig = env.CLIENT_CONFIG || "{ 'test': 0 }";
    // Create the content to be written to the config file
    const configContent = `export default ${clientConfig};\n`;
    
    // Define the path to the config file
    const configFilePath = upath.join(STATIC_CLIENT_DIR, '/_config.js');
    
    // Write the configuration content to the config file
    fs.writeFileSync(configFilePath, configContent);
    console.log(`Client Config has been generated at ${configFilePath}`);
}