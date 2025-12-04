# Environment Variables Setup

## Server (.env)

Create a `.env` file in the `server/` directory with the following variables:

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

### Description:
- `DATABASE_URL`: MySQL connection string
- `JWT_SECRET`: Secret key for signing JWT tokens (use a strong random string in production)
- `AWS_REGION`: AWS region for S3 bucket
- `AWS_ACCESS_KEY_ID`: AWS access key ID
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key
- `AWS_BUCKET_NAME`: S3 bucket name for file uploads
- `PORT`: Port number for the NestJS server (default: 3001)
- `FRONTEND_URL`: Frontend URL for CORS configuration

## Client (.env.local)

Create a `.env.local` file in the `client/` directory with the following variable:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### Description:
- `NEXT_PUBLIC_API_URL`: Backend API URL (change to production URL when deploying)

## Important Notes

1. Never commit `.env` or `.env.local` files to version control
2. These files are already included in `.gitignore`
3. Use `.env.example` files as templates (if you create them)
4. For production, use secure environment variable management provided by your hosting platform

