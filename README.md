# Multi-User Profile Platform

A full-stack application for creating and managing user profiles with portfolio, reviews, and about sections.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS, TypeScript
- **Backend**: NestJS, TypeScript, Prisma ORM
- **Database**: MySQL
- **Storage**: AWS S3
- **Authentication**: JWT (Passport)

## Project Structure

```
.
├── client/          # Next.js frontend
├── server/          # NestJS backend
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- MySQL database
- AWS account (for S3 file storage)

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `server/` directory:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/dbname"
   JWT_SECRET="your-secret-key-change-this-in-production"
   AWS_REGION="us-east-1"
   AWS_ACCESS_KEY_ID="your-aws-access-key"
   AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
   AWS_BUCKET_NAME="my-portfolio-bucket"
   PORT=3001
   FRONTEND_URL="http://localhost:3000"
   ```

4. Generate Prisma Client:
   ```bash
   npm run prisma:generate
   ```

5. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

6. Start the development server:
   ```bash
   npm run start:dev
   ```

The backend will be running on `http://localhost:3001`

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the `client/` directory:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3001"
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be running on `http://localhost:3000`

## Features

### Public Features
- View user profiles at `/[username]`
- Browse portfolios, reviews, and about sections
- Responsive design with dark mode support

### Admin Features
- User registration and authentication
- Edit profile information with avatar upload
- Manage portfolio items with image uploads
- Manage reviews (view and delete)
- Edit about section

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Profile
- `GET /users/:username/profile` - Get public profile
- `PATCH /profile` - Update profile (protected)

### Portfolio
- `GET /users/:username/portfolio` - Get public portfolio
- `POST /portfolio` - Create portfolio item (protected)
- `PATCH /portfolio/:id` - Update portfolio item (protected)
- `DELETE /portfolio/:id` - Delete portfolio item (protected)

### Reviews
- `GET /users/:username/reviews` - Get public reviews
- `POST /reviews` - Create review (public)
- `DELETE /reviews/:id` - Delete review (protected)

### About
- `GET /users/:username/about` - Get public about section
- `PATCH /about` - Update about section (protected)

## Notes

- Make sure your MySQL database is running before starting the backend
- Configure AWS S3 credentials for file uploads to work
- JWT tokens are stored in localStorage on the frontend
- Protected routes require a valid JWT token in the Authorization header
