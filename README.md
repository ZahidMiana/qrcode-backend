# QR Code Generator Backend

A powerful backend API for generating QR codes with customization options, built with Node.js, Express, TypeScript, and MongoDB.

## Features

- 🎨 Customizable QR codes (size, colors, error correction)
- 💾 MongoDB storage for QR code metadata
- 🔒 Security middleware (helmet, rate limiting, CORS)
- ✅ Input validation and sanitization
- 📥 Download QR codes in multiple formats
- 🔗 Shareable links for generated QR codes
- 📊 RESTful API with proper error handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **QR Generation**: qrcode library
- **Testing**: Jest + Supertest
- **Validation**: express-validator

## Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Copy environment file:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Update environment variables in `.env`:
\`\`\`
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/qrcode-generator
CORS_ORIGIN=http://localhost:3000
\`\`\`

## Development

Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Build for production:
\`\`\`bash
npm run build
npm start
\`\`\`

## API Endpoints

### Generate QR Code
\`POST /api/qrcode/generate\`

Request body:
\`\`\`json
{
  "input": "https://example.com",
  "options": {
    "size": "medium",
    "foregroundColor": "#000000",
    "backgroundColor": "#ffffff",
    "errorCorrectionLevel": "M",
    "margin": 4
  }
}
\`\`\`

### Get QR Code
\`GET /api/qrcode/:id\`

### Download QR Code
\`GET /api/qrcode/:id/download?format=png\`

### Get Recent QR Codes
\`GET /api/qrcode?limit=10&page=1\`

## QR Code Options

- **size**: \`small\` | \`medium\` | \`large\`
- **foregroundColor**: Hex color (e.g., \`#000000\`)
- **backgroundColor**: Hex color (e.g., \`#ffffff\`)
- **errorCorrectionLevel**: \`L\` | \`M\` | \`Q\` | \`H\`
- **margin**: Number between 0-20

## Testing

Run tests:
\`\`\`bash
npm test
\`\`\`

Run tests in watch mode:
\`\`\`bash
npm run test:watch
\`\`\`

## Security Features

- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Error handling middleware

## License

MIT
