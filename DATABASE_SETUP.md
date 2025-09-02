# Database Setup Guide

This guide will help you set up PostgreSQL and run the database migrations for the Car Auto Backend project.

## Prerequisites

- PostgreSQL installed and running
- Node.js/Bun installed
- Environment variables configured

## 1. Install PostgreSQL

### On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### On macOS:
```bash
brew install postgresql
brew services start postgresql
```

### On Windows:
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

## 2. Create Database

```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Create database and user
CREATE DATABASE caautobackend;
CREATE USER caautobackend_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE caautobackend TO caautobackend_user;

# Exit PostgreSQL
\q
```

## 3. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Update the `.env` file with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=caautobackend_user
DB_PASSWORD=your_password
DB_NAME=caautobackend
```

## 4. Generate and Run Migrations

```bash
# Generate migration files from schemas
bun run db:generate

# Run migrations to create tables
bun run db:migrate

# Alternative: Push schema directly (for development)
bun run db:push
```

## 5. Seed Database (Optional)

```bash
# Run the seeder to create initial data
bun run src/db/seed.ts
```

## 6. Database Studio (Optional)

View and manage your database with Drizzle Studio:

```bash
bun run db:studio
```

## Available Scripts

- `bun run db:generate` - Generate migration files from schema changes
- `bun run db:migrate` - Run pending migrations
- `bun run db:push` - Push schema changes directly (development only)
- `bun run db:studio` - Open Drizzle Studio for database management

## Database Schema Overview

The database includes the following tables:

- **users** - User accounts and authentication
- **categories** - Product categories (Sedans, SUVs, etc.)
- **products** - Car listings with details
- **cart_items** - Shopping cart functionality
- **orders** - Order management
- **order_items** - Individual items in orders
- **reviews** - Product reviews and ratings
- **auth_tokens** - JWT refresh tokens and verification tokens

## Troubleshooting

### Connection Issues
- Ensure PostgreSQL is running: `sudo systemctl status postgresql`
- Check if the database exists: `psql -U postgres -l`
- Verify user permissions: `psql -U caautobackend_user -d caautobackend`

### Migration Issues
- Check migration files in `src/db/migrations/`
- Ensure all environment variables are set correctly
- Try running migrations manually: `bun run src/db/migrate.ts`

### Schema Changes
- After modifying schemas, always run `bun run db:generate`
- Review generated migration files before running `bun run db:migrate`
- For development, you can use `bun run db:push` for quick schema updates
