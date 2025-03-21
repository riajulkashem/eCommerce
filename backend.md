
# Backend Documentation

The backend is built with Django, using PostgreSQL as the database and UV as the package manager.

## Features

###  User Authentication and Registration API
- **Endpoints**:
  - `POST /api/v1/auth/register/` - Register a new user (fields: `first_name`, `last_name`, `email`, `password`).
  - `POST /api/v1/auth/login/` - Log in and receive JWT tokens (`access` and `refresh`).
  - `POST /api/v1/auth/token/refresh/` - Refresh an access token.
  - `POST /api/v1/auth/logout/` - Log out and invalidate tokens.
- **Security**: Uses JWT stored in cookies for stateless, secure authentication.

### E-commerce API Development
- **Models**:
  - `Category`: Product categories (fields: `name`, `description`).
  - `Product`: Products (fields: `name`, `description`, `price`, `category`).
  - `Stock`: Inventory tracking (fields: `product`, `quantity`, `location`).
- **Endpoints**:
  - `GET /api/v1/products/product/` - List all products.
  - `POST /api/v1/products/product/` - Create a product (authenticated).
  - `GET /api/v1/products/product/<id>/` - Retrieve a product.
  - `PUT /api/v1/products/product/<id>/` - Update a product (authenticated).
  - `DELETE /api/v1/products/product/<id>/` - Delete a product (authenticated).
  - Similar CRUD endpoints for `Category` and `Stock`.
- **Database**: PostgreSQL via Docker.

### Security
- **JWT Authentication**: Integrated with Django REST Framework SimpleJWT.
- **Dockerized**: Runs with Gunicorn for production readiness.

## Setup Details

- **Dependencies**: Managed with UV However you can use pip, it works fine with both (see `requirements.txt`).
- **Dockerfile**: Multi-stage build for efficiency.
- **Static/Media Files**: Served via Nginx with persistent volumes.

## Running Locally (Outside Docker)
```bash
make install-backend
make run-backend
```
- Access at http://localhost:8000
### Custom Commands
- **Superuser:** `make superuser` - Creates an admin user.
- **Dummy Data:** `make dummy-data` - Populates sample data.