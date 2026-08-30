# ShopSphere - E-Commerce DevOps Portfolio Project

A simple but realistic 3-tier e-commerce application (React + Spring Boot + MySQL), built as the
foundation for a production-style DevOps/Cloud deployment pipeline (Docker → AWS ECR → Kubernetes/EKS
→ Helm → Terraform → GitHub Actions → SonarQube → Nexus → Trivy → Prometheus → Grafana).

This repository contains **only the application source code**. Kubernetes manifests, Helm charts,
Terraform, CI/CD pipelines, and monitoring configs are intentionally left for later phases.

---

## Project Overview

Customers can browse products, filter by category, search, manage a cart, and place orders.
Admins can add, update, delete products and adjust stock levels. The backend exposes a clean REST
API with Actuator health/metrics endpoints so it is ready to be scraped by Prometheus once deployed.

## Architecture

```
Browser
   |
   v
Frontend (React + Vite, served by Nginx)
   |
   v  REST / JSON over HTTP
Backend (Spring Boot REST API)
   |
   v  Spring Data JPA
MySQL Database
```

Planned production deployment target (future phases, not included in this repo):

```
Internet
   |
   v
AWS Load Balancer
   |
   v
Kubernetes Ingress
   |            |
   v            v
Frontend Svc   Backend Svc
   |            |
   v            v
React/Nginx    Spring Boot Pods
   Pods            |
                    v
              AWS RDS MySQL
```

## Technologies

| Layer      | Technology                                              |
|------------|----------------------------------------------------------|
| Frontend   | React 18, Vite, React Router, Axios                       |
| Backend    | Java 17, Spring Boot 3, Spring Data JPA, Spring Validation, Spring Boot Actuator, Micrometer/Prometheus, springdoc-openapi |
| Database   | MySQL 8                                                    |
| Build      | Maven (backend), npm (frontend)                            |
| Container  | Docker (multi-stage builds), Docker Compose                |
| Testing    | JUnit 5, Mockito, MockMvc                                  |

---

## Prerequisites

- Docker and Docker Compose (recommended way to run everything)
- OR, for local (non-Docker) development:
  - Java 17+
  - Maven 3.9+
  - Node.js 20+
  - MySQL 8 running locally

---

## Quick Start (Docker Compose - recommended)

```bash
git clone <your-repo-url>
cd ecommerce-devops-project
cp .env.example .env
docker compose up -d
```

This starts three containers:

- `mysql` on port `3306`
- `backend` on port `8080`
- `frontend` on port `5173`

Once healthy, open:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api
- Swagger UI: http://localhost:8080/swagger-ui.html
- Health check: http://localhost:8080/actuator/health
- Prometheus metrics: http://localhost:8080/actuator/prometheus

To stop everything:

```bash
docker compose down          # stop containers, keep data
docker compose down -v       # stop containers AND wipe the MySQL volume
```

---

## Backend Setup (run locally without Docker)

```bash
cd backend

# Set environment variables (or export them, or use an IDE run config)
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=ecommerce_db
export DB_USERNAME=ecommerce_user
export DB_PASSWORD=ecommerce_pass

mvn spring-boot:run
```

The backend will start on `http://localhost:8080` and auto-create/update the schema
(`ddl-auto=update`), then load seed data from `src/main/resources/data.sql`.

### Run backend tests

```bash
cd backend
mvn test
```

### Build the JAR

```bash
cd backend
mvn clean package
# Produces target/ecommerce-backend-1.0.0.jar
```

---

## Frontend Setup (run locally without Docker)

```bash
cd frontend
npm install

# Point the app at your backend (defaults to http://localhost:8080/api)
echo "VITE_API_BASE_URL=http://localhost:8080/api" > .env

npm run dev
```

The frontend will start on `http://localhost:5173`.

---

## MySQL Setup (manual, without Docker)

```sql
CREATE DATABASE ecommerce_db;
CREATE USER 'ecommerce_user'@'%' IDENTIFIED BY 'ecommerce_pass';
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecommerce_user'@'%';
FLUSH PRIVILEGES;
```

The backend will create all tables automatically on first run via Hibernate
(`spring.jpa.hibernate.ddl-auto=update`) and populate seed data via `data.sql`.

---

## Docker Setup (build images individually)

```bash
# Backend
cd backend
docker build -t ecommerce-backend:1.0.0 .

# Frontend
cd ../frontend
docker build -t ecommerce-frontend:1.0.0 --build-arg VITE_API_BASE_URL=http://localhost:8080/api .
```

---

## Docker Compose Setup

Already covered in **Quick Start** above. Key things to know:

- `docker-compose.yml` reads variables from `.env` (copy `.env.example` first).
- The `backend` service waits for MySQL's healthcheck before starting.
- The `frontend` build receives `VITE_API_BASE_URL` as a **build arg**, because Vite bakes
  environment variables into the static build at build time, not at container runtime.

---

## Environment Variables

| Variable                | Used by  | Description                                      | Default                          |
|--------------------------|----------|---------------------------------------------------|-----------------------------------|
| `DB_HOST`                | backend  | MySQL hostname                                     | `localhost`                       |
| `DB_PORT`                | backend  | MySQL port                                         | `3306`                            |
| `DB_NAME`                | backend  | Database name                                      | `ecommerce_db`                    |
| `DB_USERNAME`            | backend  | Database user                                      | `ecommerce_user`                  |
| `DB_PASSWORD`            | backend  | Database password                                  | `ecommerce_pass`                  |
| `SERVER_PORT`            | backend  | Port Spring Boot listens on                        | `8080`                            |
| `CORS_ALLOWED_ORIGINS`   | backend  | Comma-separated allowed origins for CORS           | `http://localhost:5173`           |
| `DDL_AUTO`               | backend  | Hibernate schema strategy                          | `update`                          |
| `SQL_INIT_MODE`          | backend  | Whether to run `data.sql` on startup               | `always`                          |
| `MYSQL_ROOT_PASSWORD`    | mysql    | Root password for the MySQL container              | `rootpass`                        |
| `VITE_API_BASE_URL`      | frontend | Backend API base URL (baked in at build time)      | `http://localhost:8080/api`       |

In Kubernetes, `DB_HOST/PORT/NAME/USERNAME` map naturally to a **ConfigMap**, and
`DB_PASSWORD` / `MYSQL_ROOT_PASSWORD` map to a **Secret** - this separation was intentional
from day one.

---

## Testing

```bash
cd backend
mvn test
```

Covers:

- Product creation, retrieval, update, stock update, delete (not-found case)
- Cart: add item (with and without sufficient stock), auto-create cart for new users
- Order: reject empty-cart checkout, successful order creation with stock decrement
- Controller-level test for `GET /api/products` and 404 handling

---

## Health Checks

Spring Boot Actuator is enabled with:

| Endpoint                     | Purpose                                   |
|-------------------------------|--------------------------------------------|
| `/actuator/health`            | Liveness/readiness - used by Docker/K8s probes |
| `/actuator/info`              | Build/app info                             |
| `/actuator/prometheus`        | Prometheus-formatted metrics               |
| `/actuator/metrics`           | Browsable metrics list                     |

## Prometheus Metrics

`/actuator/prometheus` exposes, among others:

- `http_server_requests_seconds_count` / `_sum` - request count & latency per endpoint
- `jvm_memory_used_bytes` - JVM heap/non-heap memory
- `process_cpu_usage` - CPU usage
- `jvm_threads_live_threads` - active threads

These will be scraped by Prometheus once the app is deployed to Kubernetes; no extra
configuration is needed on the app side beyond what's already set in `application.yml`.

---

## API Documentation

Interactive Swagger UI: **http://localhost:8080/swagger-ui.html**
Raw OpenAPI spec: **http://localhost:8080/v3/api-docs**

### Key Endpoints

```
GET    /api/products                    # all products (supports ?categoryId= or ?search=)
GET    /api/products/{id}
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
PATCH  /api/products/{id}/stock

GET    /api/categories
POST   /api/categories

GET    /api/cart/{userId}
POST   /api/cart/{userId}/items
PUT    /api/cart/{userId}/items/{itemId}
DELETE /api/cart/{userId}/items/{itemId}
DELETE /api/cart/{userId}                # clear cart

POST   /api/orders
GET    /api/orders/user/{userId}
GET    /api/orders/{orderId}

POST   /api/users/register
GET    /api/users/{id}
```

### How the frontend talks to the backend

The React app never hardcodes a backend URL. `frontend/src/services/api.js` reads
`import.meta.env.VITE_API_BASE_URL` (injected at Docker build time, or from a local `.env`
file for `npm run dev`) and all service modules (`productService.js`, `cartService.js`,
`orderService.js`, `categoryService.js`) route through that single Axios instance.

The frontend currently operates as a single seeded demo customer (`user id = 1`,
`customer@example.com`) for cart/order operations, kept intentionally simple since full
auth/session management was explicitly out of scope for this phase (see below).

---

## Project Directory Structure

```
ecommerce-devops-project/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/ecommerce/
│   │   │   │   ├── controller/       # REST controllers
│   │   │   │   ├── service/          # Service interfaces
│   │   │   │   ├── service/impl/     # Service implementations
│   │   │   │   ├── repository/       # Spring Data JPA repositories
│   │   │   │   ├── entity/           # JPA entities
│   │   │   │   ├── dto/              # Response DTOs
│   │   │   │   ├── dto/request/      # Request DTOs (validated)
│   │   │   │   ├── exception/        # Custom exceptions + global handler
│   │   │   │   ├── config/           # CORS, Swagger config
│   │   │   │   └── EcommerceApplication.java
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── data.sql
│   │   └── test/                     # Unit + controller tests
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/               # Navbar, Footer, ProductCard, etc.
│   │   ├── pages/                    # Home, Products, Cart, Orders, Admin
│   │   ├── services/                 # Axios API layer
│   │   ├── context/                  # CartContext
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── nginx.conf
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## What Was Intentionally Left Out (for this phase)

Per the project scope, this version does **not** include:

- Payment gateway / real payment processing
- Complex OAuth (basic BCrypt-hashed password registration only, no login/session/JWT flow yet)
- Microservices split (this is a clean modular monolith, ready to split later)
- Kafka, Redis, Elasticsearch
- Kubernetes manifests, Helm charts, Terraform, GitHub Actions, SonarQube server config,
  Nexus credentials, Prometheus/Grafana deployment - these come in later phases, on top of
  this working application.

## Next Steps (future phases)

1. Dockerize (done here) → push images to AWS ECR
2. Write Kubernetes manifests / Helm charts (Deployment, Service, Ingress, ConfigMap, Secret, HPA)
3. Provision infra with Terraform (VPC, EKS, RDS, ECR)
4. Build the GitHub Actions pipeline (Maven build → tests → SonarQube → Nexus → Docker build →
   Trivy scan → push to ECR → Helm deploy to EKS)
5. Deploy Prometheus + Grafana for metrics, and CloudWatch/Loki for logs
