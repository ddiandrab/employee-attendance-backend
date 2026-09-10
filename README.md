# Employee Attendance Backend

Backend service for the Employee Attendance application.
The application provides authentication, employee management, attendance management, notification, and asynchronous audit logging.

## Features

* User authentication with JWT
* Password hashing with Argon2
* Role-based access control (RBAC)
  * ADMIN
  * HR
  * EMPLOYEE
* Employee profile management
* Employee self-service profile update
* Employee management for HR/Admin
* Attendance check-in and check-out
* Attendance history with date filtering
* Notification management
* Asynchronous employee profile audit logging
* Google Cloud Pub/Sub integration
* Separate PostgreSQL database for audit logs
* Pub/Sub emulator support for local development


## Technology Stack

| Technology           | Version / Usage             |
| -------------------- | --------------------------- |
| Node.js              | 24.20.0                     |
| TypeScript           | 6.x                         |
| NestJS               | 12.x                        |
| PostgreSQL           | 16                          |
| Prisma               | 8.0.0 RC                    |
| Prisma PostgreSQL    | 8.0.0 RC                    |
| JWT                  | Authentication              |
| Passport             | JWT authentication strategy |
| Argon2               | Password hashing            |
| Google Cloud Pub/Sub | Asynchronous messaging      |
| `pg`                 | Audit PostgreSQL connection |
| Docker               | Local PostgreSQL            |
| Docker Compose       | Local infrastructure        |
| npm                  | Package management          |


## Database

The application uses two PostgreSQL databases.

### Main Database

Used for transactional application data:

```text
employee_attendance
```

### Audit Database

Used separately for asynchronous audit logging:

```text
employee_audit_log
```

The separation prevents audit logging data from being tightly coupled with the main transactional database.

## Environment Variables

Create a `.env` file in the backend project:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/employee_attendance"
AUDIT_DATABASE_URL="postgresql://postgres:postgres@localhost:5433/employee_audit_log"
JWT_SECRET="development-secret-change-me"

PUBSUB_PROJECT_ID="employee-attendance-local"
PUBSUB_TOPIC="employee-events"
PUBSUB_SUBSCRIPTION="employee-audit-log"
```

> These values are intended for local development only.

## Prerequisites

Make sure the following are installed:

* Node.js 24
* npm
* Docker
* Docker Compose
* Google Cloud CLI (`gcloud`)

Check the versions:

```bash
node --version
npm --version
docker --version
docker compose version
gcloud --version
```

## Installation

Clone the project and enter the backend directory:

```bash
cd employee-attendance-backend
```

Install dependencies:

```bash
npm install
```

## Start PostgreSQL

The project uses Docker Compose for the PostgreSQL databases.

Start the containers:

```bash
docker compose up -d
```

The containers are:

```text
employee-attendance-postgres
    localhost:5432

employee-attendance-audit-postgres
    localhost:5433
```

Check running containers:

```bash
docker ps
```

## Initialize the Main Database

The project uses Prisma 8 RC.
After changing the Prisma contract, emit the database contract:

```bash
npx prisma contract emit
```

Then update the database:

```bash
npx prisma db update
```

## Start Pub/Sub Emulator

The audit functionality uses Google Cloud Pub/Sub.
For local development, use the Pub/Sub emulator instead of the real Google Cloud Pub/Sub service.

### Terminal 1

Start the emulator:

```bash
gcloud beta emulators pubsub start
```

Keep this terminal running.

### Terminal 2

Initialize the emulator environment:

```bash
$(gcloud beta emulators pubsub env-init)
```

Verify:

```bash
echo $PUBSUB_EMULATOR_HOST
```

The variable should contain the emulator host.

Then start the NestJS application in the **same terminal**:

```bash
npm run start:dev
```

This is important because the Google Cloud Pub/Sub client needs `PUBSUB_EMULATOR_HOST` to know that it should connect to the local emulator instead of the real Google Cloud service.

## Run the Application

Development mode:

```bash
npm run start:dev
```

The backend will run on:

```text
http://localhost:3000
```

Build the application:

```bash
npm run build
```

Run the compiled application:

```bash
npm run start:prod
```


## Local Development Flow

A complete local setup requires three processes:

### Terminal 1 — PostgreSQL

```bash
docker compose up -d
```

### Terminal 2 — Pub/Sub Emulator

```bash
gcloud beta emulators pubsub start
```

### Terminal 3 — Backend

```bash
$(gcloud beta emulators pubsub env-init)
npm run start:dev
```
