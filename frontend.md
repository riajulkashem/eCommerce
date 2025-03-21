# Frontend Documentation

The frontend is built with Next.js, using `pnpm` as the package manager.

## Features

- **User Authentication**:
  - Login and registration forms integrated with the backend.
  - Profile management with tabs for details and password updates.
- **E-commerce Interface**:
  - Product listings with categories and stock details.
  - CRUD operations for products (authenticated users).
  - Responsive design with Tailwind CSS and custom components.
- **Dynamic Routing**: Uses Next.js routes (e.g., `/profile`, `/product/[id]/edit`).
- **API Integration**: Connects to `BASE_API_URL` (`http://nginx:80/api`).

## Setup Details

- **Dependencies**: Managed with `pnpm` (see `package.json`).
- **Dockerfile**: Multi-stage build for production.
- **Routing**: Nginx proxies requests from `/` to `frontend:3000`.


## Running Locally (Outside Docker)
```bash
make install-frontend
make run-frontend
```
- Access at http://localhost:3000
