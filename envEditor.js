import fs from 'fs';
import os from 'os';

function updateEnv(key, newValue) {
    const envPath = '.env';
    const envData = fs.readFileSync(envPath, 'utf8');
    const lines = envData.split(os.EOL);
    let keyFound = false;

    // Modify the line that starts with the target key
    const updatedLines = lines.map(line => {
        if (line.trim() === '' || line.startsWith('#')) return line;
        const [currentKey, ...rest] = line.split('=');
        if (currentKey === key) {
        keyFound = true;
        return `${key}=${newValue}`;
        }
        return line;
    });

    if (!keyFound) {
        updatedLines.push(`${key}=${newValue}`);
    }

    fs.writeFileSync(envPath, updatedLines.join(os.EOL));
}

// updateEnv('ENABLE_CAPTCHA', 'false');
// updateEnv('ORIGINAL_ADMIN_EMAIL', '"evankue@gmail.com"');