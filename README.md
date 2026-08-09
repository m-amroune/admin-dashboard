# Admin Dashboard

Admin dashboard built with Next.js, TypeScript, Prisma and PostgreSQL.

**Live demo:** https://admin-dashboard-m-amroune.vercel.app/login

<p align="center">
  <img src="./assets/admin-dashboard-preview.png" alt="Admin Dashboard preview" width="900" />
</p>

## About the Project

### Objective

Build an admin dashboard to manage users and orders through a simple data-driven interface.

The project focuses on:

* Clear feature separation
* Realistic admin workflows
* Server-side data with Prisma and PostgreSQL
* Maintainable structure
* Automated testing of key behaviors

The authentication system is intentionally simplified for demonstration purposes and is not intended for production use.

---

## Project Overview

The dashboard includes the following modules:

* **Dashboard**
  Overview of total users, total orders and order distribution by status.

* **Authentication**
  Login page with a cookie-based demo session, protected dashboard routes and logout.

* **Users Management**
  Users list, user creation, deletion and role management between `user` and `admin`.

* **Orders Management**
  Orders list, individual order detail pages and status updates through the `pending`, `paid` and `shipped` workflow.

* **Health Check**
  API endpoint that checks the PostgreSQL database connection.


---

## Built With

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwindcss&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white)
![Testing Library](https://img.shields.io/badge/Testing_Library-E33332?style=flat&logo=testinglibrary&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=flat&logo=npm&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

---

## Features

- Protected dashboard routes
- Shared dashboard layout with sidebar navigation
- Users CRUD operations
- - Orders listing, detail view and status updates

---

## Installation

```bash
git clone https://github.com/m-amroune/admin-dashboard.git
cd admin-dashboard
npm install
npm run dev

```
