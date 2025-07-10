const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create certificates directory if it doesn't exist
const certsDir = path.join(process.cwd(), 'certificates');
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir);
}

// Generate self-signed certificate
console.log('Generating self-signed certificates for HTTPS...');

try {
  // Generate private key
  execSync('openssl genrsa -out certificates/localhost-key.pem 2048', { stdio: 'inherit' });
  
  // Generate CSR
  execSync(
    'openssl req -new -key certificates/localhost-key.pem -out certificates/localhost.csr -subj "/CN=localhost"',
    { stdio: 'inherit' }
  );
  
  // Generate certificate
  execSync(
    'openssl x509 -req -days 365 -in certificates/localhost.csr -signkey certificates/localhost-key.pem -out certificates/localhost.pem',
    { stdio: 'inherit' }
  );
  
  console.log('Certificates generated successfully!');
  console.log('To use HTTPS in development, run: npm run dev:https');
} catch (error) {
  console.error('Error generating certificates:', error.message);
  console.log('If you\'re on Windows, make sure you have OpenSSL installed or use Git Bash.');
  console.log('Alternatively, you can use mkcert: https://github.com/FiloSottile/mkcert');
} 