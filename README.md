# Rent2Sell

A modern rental platform built with Next.js 13, Prisma, and TypeScript.

## Features

- 🛠️ Built with Next.js 13 (App Router)
- 🔐 Authentication with NextAuth.js
- 💾 Database with Prisma & PostgreSQL
- 🎨 Styling with Tailwind CSS
- 📱 Responsive design
- 🖼️ Image upload with Cloudinary
- 🌍 Multi-language support
- 👤 User profiles and management
- 📊 Admin dashboard
- 💳 Rental management system

## Demo Credentials

For testing purposes, you can use the following admin account:

- Email: admin@rent2sail.com
- Password: password123
- Role: ADMIN

## Getting Started

### Prerequisites

- Node.js 16+
- PostgreSQL
- Cloudinary account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rent2sell.git
```

2. Install dependencies:
```bash
cd rent2sell
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Then edit `.env.local` with your values.

4. Run database migrations:
```bash
yarn prisma migrate dev
```

5. Start the development server:
```bash
yarn dev
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Application
NEXT_PUBLIC_APP_NAME="Rent2sell"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Database
DATABASE_URL="your-database-url"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"

# OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.