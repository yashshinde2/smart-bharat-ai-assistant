# HTTPS Setup for Smart Bharat

This guide explains how to run the Smart Bharat application with HTTPS, which is required for features like Google Translate and voice recognition.

## Option 1: Using the Custom Server (Recommended)

1. Generate self-signed certificates:
   ```
   npm run generate-certificates
   ```

2. Start the development server with HTTPS:
   ```
   npm run dev:https
   ```

3. Access your application at `https://localhost:3000`

## Option 2: Using Next.js Built-in HTTPS

Next.js has built-in support for HTTPS in development. You can use this option if you prefer not to use a custom server.

1. Update your `package.json` scripts:
   ```json
   "scripts": {
     "dev": "next dev --experimental-https",
     "build": "next build",
     "start": "next start",
     "lint": "next lint"
   }
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Access your application at `https://localhost:3000`

## Handling Browser Security Warnings

When using self-signed certificates, browsers will show security warnings. To proceed:

1. Click "Advanced" or "More Information"
2. Click "Proceed to localhost" or "Accept the Risk and Continue"

## Production Deployment

For production, you should use a proper SSL certificate from a trusted provider like Let's Encrypt, AWS Certificate Manager, or your hosting provider's SSL service.

## Troubleshooting

- If you see certificate errors, make sure your certificates are properly generated
- For Windows users, you may need to install OpenSSL or use Git Bash to run the certificate generation script
- Alternatively, you can use [mkcert](https://github.com/FiloSottile/mkcert) for easier certificate generation 