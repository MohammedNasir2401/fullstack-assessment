# Task-[Confidential] Monorepo

This monorepo contains two main projects:

- `api`: Backend server
- `dashboard`: Frontend dashboard

---

## API

The `api` folder contains a TypeScript Express server with Prisma ORM.

### Features
- Express.js server
- TypeScript
- Prisma ORM (PostgreSQL by default)
- Logging (winston)
- ETL scripts for JSON data import

### Getting Started (Development)

1. **Install dependencies**
   ```bash
   cd api
   npm install
   ```
2. **Set up environment variables**
   - Copy `.env.example` to `.env` and update as needed.
3. **Run database migrations**
   ```bash
   npx prisma migrate dev --name init
   ```
4. **Start the development server**
   ```bash
   npm run dev
   ```
5. **Run ETL script**
   ``` node src/scripts/etl.js
   ```
---

## Dashboard

*Not yet started* 