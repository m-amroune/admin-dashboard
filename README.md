# Admin Dashboard

Admin dashboard built with Next.js.

---

## About the Project

### Objective

Build an admin dashboard to manage users and orders.

The project focuses on:
- Clear feature separation
- Realistic admin workflows
- Controlled scope
- Maintainable structure

---

## Project Overview

The dashboard includes the following modules:

- **Authentication**  
  Login page with authentication, session handled via cookie, protected routes and logout.

- **Users Management**  
  Users list, user creation, deletion and role toggle (user / admin).

- **Orders Management**  
  Orders list, order detail page and status updates (pending → paid → shipped).

---

## Built With

<!-- Core -->
![Next.js 16](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

<!-- Database -->
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white)

<!-- Styling -->
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

<!-- Tooling -->
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=flat&logo=npm&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)

---

## Features

- Protected dashboard routes
- Shared dashboard layout with sidebar navigation
- Users CRUD operations
- Orders status management

---

## Installation

```bash
git clone https://github.com/m-amroune/admin-dashboard.git
cd admin-dashboard
npm install
npm run dev

