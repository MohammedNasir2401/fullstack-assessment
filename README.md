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
   ```
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

1. **Install dependencies**
   ```
   cd dashboard
   npm install
   ```
2. **Start the development server**
   ```
   npm run dev
   ```
3. **Build the production bundle**
   ```
   npm run build
   ```
---

## ETL Script

The ETL script reads JSON files, transforms the data, and inserts it into the database.

**Run the ETL script**
   ```
   cd api && npx ts-node src/scripts/etl.ts
   ```
---

## Deployment

• The dashboard is deployed on Vercel.

• The API is deployed on an AWS EC2 instance, and the database is hosted on AWS RDS.

## Approach

For the ETL script, I read the JSON files, transformed the data into a unified format, and then inserted it into the database. Initially my Schema was complex, but I simplified it to a single table with type and source fields, accomodating for more data source (in the future). 