const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if certificates exist
const certPath = path.join(process.cwd(), 'certificates', 'localhost.pem');
const keyPath = path.join(process.cwd(), 'certificates', 'localhost-key.pem');

if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
  console.log('Certificates not found. Generating certificates...');
  try {
    execSync('node scripts/generate-certificates.js', { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to generate certificates:', error.message);
    console.log('Please run npm run generate-certificates manually.');
    process.exit(1);
  }
}

// Start the server with HTTPS
console.log('Starting server with HTTPS...');
try {
  execSync('node server.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to start server:', error.message);
  process.exit(1);
} 