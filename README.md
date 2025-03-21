# E-commerce Online Platform

This project is a full-stack e-commerce application with a Django backend and a Next.js frontend. It includes user authentication, a simple e-commerce API, JWT-based authentication, Dockerization.

## Project Overview

- User Authentication and Registration API
  - Implements user registration and login with JWT-based authentication.
  - JWT authentication for enhanced security.
- E-commerce API Development
  - Provides CRUD operations for `Product`, `Stock`, and `Category` models.
- Dockerized application using Docker Compose.

## How to Set Up and Run

### 1. Clone the Repository
```bash
git clone https://github.com/riajulkashem/eCommerce.git
cd eCommerce
```

### 2. Configure Environment Variables
Create a .env file in the root directory with the following content:
```
cp .env.example .env
```
- Replace your-secret-key-here with a secure key (e.g., generated via `python -c "import secrets; print(secrets.token_hex(32))"`).
### 3. Build and Run with Docker
```
docker-compose up --build
```
If you are used to with Makefile:
```
make up
```
**more about commands** ``make help``
- This builds and starts the backend, frontend, database, and Nginx services in detached mode.
- Access the application at http://localhost (frontend) and http://localhost/api/ (backend API).

#### Additional Commands For Docker 
* Stop the application: `make down`
* Create a superuser: `make superuser`
* Populate dummy data: `make dummy-data` it will also create a super user with email `rk@rk.com` and `rk` password
* View logs: `make logs`
* Clean up: `make clean`
* See all commands: `make help`

#### Accessing the Application
1. Frontend: http://localhost - Interactive e-commerce interface.
2. Backend API: http://localhost/api/ - RESTful endpoints (e.g., `/api/v1/products/`).
3. Admin Panel: http://localhost/api/admin/ - Log in with superuser credentials.

### 4. Run backend with local environment
```
# First navigate to backend folder
cd backend

# Copy env 
cp .env.example .env

# Create virtual environment 
python -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install uv
pip install -r requirements.txt

# Run development server
python manage.py runserver
```

### 5. Run frontend with local environment
```
# First navigate to frontend folder
cd frontend

# Install dependencies 
npm install

# Run server
npm run dev
```


## References
* Authentication: [DRF Next Auth](https://github.com/riajulkashem/drf-next-auth) - Guide for integrating Django REST Framework with Next.js authentication.
* Full Stack Project Setup: [Building a Full-Stack Application](https://medium.com/@xinlyuwang96/building-a-full-stack-application-with-docker-django-next-js-and-postgresql-part-1-2d9c28874aa6) with Docker, Django, Next.js, and PostgreSQL - Detailed Docker setup tutorial.
* Django Documentation: Official [Django Documentation](https://docs.djangoproject.com/en/5.1/) - Primary source for Django features and usage.
* Next.js Documentation: Official [Next.js Documentatio](https://nextjs.org/docs)n - Official guide for Next.js development.
* JWT Authentication: Django REST Framework [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/customizing_token_claims.html) - Documentation for JWT implementation in Django.
* Docker Documentation: Official Docker Documentation - Comprehensive Docker resource.