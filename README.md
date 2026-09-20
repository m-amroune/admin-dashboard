# Admin Dashboard

Admin dashboard built with Next.js, TypeScript, Prisma and PostgreSQL.

**Live demo:** https://admin-dashboard-m-amroune.vercel.app/login

<p align="center">
  <img src="./assets/admin-dashboard-preview.png" alt="Admin Dashboard preview" width="900" />
</p>

## About the Project

### Objective

Build a full-stack admin dashboard to manage users and orders through a realistic data-driven interface.

The project focuses on:

- Clear feature separation
- Realistic admin workflows
- Server-side data management with Prisma and PostgreSQL
- Authentication and protected operations
- Search, filtering, sorting and pagination
- Maintainable structure
- Automated unit and end-to-end testing

---

## Project Overview

The dashboard includes the following modules:

- **Dashboard**  
  Overview of total users, total orders and order distribution by status.

- **Authentication**  
  Auth.js credentials authentication with bcrypt password hashing, protected routes, protected Server Actions and logout.

- **Users Management**  
  User creation, deletion, role management, search, filtering, sorting and server-side pagination.

- **Orders Management**  
  Order creation, detail pages, status updates, search, filtering, sorting, pagination, bulk actions and status history.

- **Health Check**  
  API endpoint that checks the PostgreSQL database connection.

### Order Workflow

```text
pending -> paid
pending -> cancelled
paid -> shipped
paid -> cancelled
```

`shipped` and `cancelled` are final states.

---   
## Built With 

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat&logo=supabase&logoColor=white)
![Auth.js](https://img.shields.io/badge/Auth.js-000000?style=flat)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwindcss&logoColor=white)
![TanStack Table](https://img.shields.io/badge/TanStack_Table-FF4154?style=flat&logo=reactquery&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white)
![Testing Library](https://img.shields.io/badge/Testing_Library-E33332?style=flat&logo=testinglibrary&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=githubactions&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=flat&logo=npm&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

---

## Features

- Auth.js authentication
- Protected routes and Server Actions
- Shared dashboard layout with sidebar navigation
- Dashboard metrics and order status visualization
- Server-side Users and Orders tables
- Search, filters, sorting and pagination
- Users CRUD and role management
- Orders CRUD and status workflow
- Order status history
- Multi-selection and bulk order actions
- Realistic deterministic seed data
- PostgreSQL health check

---

## Testing

### Jest + React Testing Library

Unit and integration tests cover key pages, components and application logic.

```bash
npm test
```

### Playwright E2E

18 end-to-end tests cover:

- Login and logout
- Protected routes
- Authenticated navigation
- Search, filters, sorting and pagination
- Order creation, status updates and deletion
- Bulk order actions
- User creation, role updates and deletion

The E2E suite uses an isolated PostgreSQL 16 database with Docker, separate from the Supabase application database.

```bash
docker compose -f docker-compose.e2e.yml up -d
npm run test:e2e
```

GitHub Actions also runs the E2E suite with a temporary PostgreSQL service on pull requests and pushes to `main`.

---

## Installation

```bash
git clone https://github.com/m-amroune/admin-dashboard.git
cd admin-dashboard
npm install
```

Create the required environment variables:

```env
DATABASE_URL="your-postgresql-connection-string"
AUTH_SECRET="your-auth-secret"
```

Generate the Prisma Client and apply the database migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

Optionally populate the database with demo data:

```bash
npx prisma db seed
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```