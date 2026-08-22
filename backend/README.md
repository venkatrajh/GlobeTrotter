# GlobeTrotter Backend

This is the Node.js + Express backend foundation for the GlobeTrotter hackathon project.

## Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL (via Supabase)

## Installation
1. Navigate to the `backend` directory.
2. Run `npm install` to install all dependencies.

## Configuration
1. Copy `.env.example` to `.env`.
   ```bash
   cp .env.example .env
   ```
2. Update the `DATABASE_URL` in `.env` with your PostgreSQL connection string.
3. Update `JWT_SECRET` with a secure random string.

## Database Setup
1. Generate the Prisma client:
   ```bash
   npm run prisma:generate
   ```
2. Apply migrations to your database:
   ```bash
   npm run prisma:migrate
   ```

## Running the Server
- **Development mode** (auto-restarts on changes):
  ```bash
  npm run dev
  ```
- **Production mode**:
  ```bash
  npm start
  ```

## Running Tests
To run the Jest test suite:
```bash
npm test
```
