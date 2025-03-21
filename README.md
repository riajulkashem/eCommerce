# E-commerce Online Platform

This project is a full-stack e-commerce application with a Django backend and a Next.js frontend. It includes user authentication, a simple e-commerce API, JWT-based authentication, Dockerization.

## Project Overview

- User Authentication and Registration API
  - Implements user registration and login with JWT-based authentication.
  - JWT authentication for enhanced security.
- E-commerce API Development
  - Provides CRUD operations for `Product`, `Stock`, and `Category` models.
- Dockerized application using Docker Compose.

### Prerequisites

- Docker and Docker Compose installed on your machine.
- Git to clone the repository.
- A terminal for running commands.

### Project Structure
````
ecommerce/
├── backend/           # Django backend code
├── frontend/          # Next.js frontend code
├── docker-compose.yml # Docker Compose configuration
├── nginx.conf         # Nginx configuration for routing
├── .env              # Environment variables (create this file)
├── Makefile          # Automation for common tasks
├── backend.md        # Backend documentation
├── frontend.md       # Frontend documentation
└── README.md         # Main instructions (this file)
````
## How to Set Up and Run

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ecommerce.git
cd ecommerce
```

### 2. Configure Environment Variables
Create a .env file in the root directory with the following content:
```
SECRET_KEY=your-secret-key-here
DATABASE_NAME=postgres
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_USER=postgres
POSTGRES_DB=postgres
DATABASE_HOST=db
DATABASE_PORT=5432
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
BASE_API_URL=http://127.0.0.1:8000/api/v1
```
- Replace your-secret-key-here with a secure key (e.g., generated via `python -c "import secrets; print(secrets.token_hex(32))"`).
### 3. Build and Run with Docker
Use the provided Makefile:
```
make up
```
- This builds and starts the backend, frontend, database, and Nginx services in detached mode.
- Access the application at http://localhost (frontend) and http://localhost/api/ (backend API).

### 4. Additional Commands
* Stop the application: `make down`
* Create a superuser: `make superuser`
* Populate dummy data: `make dummy-data`
* View logs: `make logs`
* Clean up: `make clean`
* See all commands: `make help`

### Accessing the Application
1. Frontend: http://localhost - Interactive e-commerce interface.
2. Backend API: http://localhost/api/ - RESTful endpoints (e.g., `/api/v1/products/`).
3. Admin Panel: http://localhost/api/admin/ - Log in with superuser credentials.

## References
* Authentication: [DRF Next Auth](https://github.com/riajulkashem/drf-next-auth) - Guide for integrating Django REST Framework with Next.js authentication.
* Full Stack Project Setup: [Building a Full-Stack Application](https://medium.com/@xinlyuwang96/building-a-full-stack-application-with-docker-django-next-js-and-postgresql-part-1-2d9c28874aa6) with Docker, Django, Next.js, and PostgreSQL - Detailed Docker setup tutorial.
* Django Documentation: Official [Django Documentation](https://docs.djangoproject.com/en/5.1/) - Primary source for Django features and usage.
* Next.js Documentation: Official [Next.js Documentatio](https://nextjs.org/docs)n - Official guide for Next.js development.
* JWT Authentication: Django REST Framework [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/customizing_token_claims.html) - Documentation for JWT implementation in Django.
* Docker Documentation: Official Docker Documentation - Comprehensive Docker resource.