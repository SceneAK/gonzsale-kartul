import fs from 'fs';
import upath from 'upath';
import process from 'process';

export function initClientConfig(){
    const clientConfig = process.env.CLIENT_CONFIG || "{ 'test': 0 }";
    // Create the content to be written to the config file
    const configContent = `export default ${clientConfig};\n`;
    
    // Define the path to the config file
    const configFilePath = upath.join(import.meta.dirname, '/Client/_config.js');
    
    // Write the configuration content to the config file
    fs.writeFileSync(configFilePath, configContent);
    console.log(`Client Config has been generated at ${configFilePath}`);
}