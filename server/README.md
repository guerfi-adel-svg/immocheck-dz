# ImmoCheck DZ - Server

Backend API server for the ImmoCheck DZ real estate platform built with Express.js and MongoDB.

## Features

- User authentication (Register/Login)
- JWT token-based authorization
- Property listings with filters and search
- User profile management
- MongoDB integration
- TypeScript support
- Input validation
- Error handling

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration

## Running the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (authenticated)
- `PUT /api/properties/:id` - Update property (authenticated)
- `DELETE /api/properties/:id` - Delete property (authenticated)

### Users
- `GET /api/users/profile` - Get current user profile (authenticated)
- `PUT /api/users` - Update profile (authenticated)
- `GET /api/users/:id` - Get user by ID

## Project Structure

```
server/
├── src/
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   └── index.ts         # Server entry point
├── dist/                # Compiled JavaScript
├── package.json
├── tsconfig.json
└── .env.example
```

## Environment Variables

See `.env.example` for all available configuration options.

## License

MIT
