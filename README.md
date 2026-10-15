
# COMP3123 Assignment 1 - Secure REST API

**Student ID:** 101609906  
**Course:** COMP3123 - Full Stack Development  
**Assignment:** Assignment 1 - Backend

## 1. Project Overview

This project is a REST API built using Node.js, Express.js, and MongoDB. It allows users to create an account, log in, and manage employee information through a set of API endpoints.

Each user can add, view, update, and delete their own employee records. To keep employee information private, users can only access records they created.

The application also includes security features such as password hashing, JWT authentication, input validation, and rate limiting. Error handling and logging are included to help manage problems and keep track of application activity.

## 2. Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JavaScript
- bcryptjs
- JSON Web Tokens (JWT)
- express-validator
- Helmet
- express-rate-limit
- Morgan
- Winston
- dotenv
- Postman
- Docker
- Git and GitHub

## 3. Project Structure

```text
101609906_COMP3123_Assignment1/
├── config/
│   └── db.js
├── controllers/
│   ├── employeeController.js
│   └── userController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── rateLimiter.js
├── models/
│   ├── Employee.js
│   └── User.js
├── routes/
│   ├── employeeRoutes.js
│   └── userRoutes.js
├── validators/
│   ├── employeeValidator.js
│   └── userValidator.js
├── utils/
│   └── logger.js
├── logs/
├── Proof/
│   └── MongoDB/
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

## 4. Installation and Setup

### Requirements
- Node.js and npm
- Docker Desktop
- Postman
- Git

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/NathanSehatz/101609906_COMP3123_Assignment1.git
   cd 101609906_COMP3123_Assignment1
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file using `.env.example`.

4. Start MongoDB using Docker:
   ```bash
   docker run -d --name comp3123-mongodb -p 127.0.0.1:27017:27017 -v comp3123-mongodb-data:/data/db mongo:7.0
   ```

   If the container already exists:
   ```bash
   docker start comp3123-mongodb
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

The API runs at `http://localhost:3000`.

Use `npm start` to run without automatic restarts.

## 5. Environment Configuration

Create a `.env` file in the project folder:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/comp3123_assignment1
JWT_SECRET=your_secure_jwt_secret
```

- `PORT` - Server port.
- `MONGODB_URI` - MongoDB connection string.
- `JWT_SECRET` - Secret used to sign and verify JWTs.

Generate a JWT secret using:

```bash
openssl rand -hex 32
```

The `.env` file is excluded from GitHub through `.gitignore`. The `.env.example` file contains placeholder values for configuration.

## 6. API Endpoints

The API uses the following endpoints:

### User Authentication

| Method | Endpoint | Description | Success Status |
|--------|----------|-------------|----------------|
| POST | /api/v1/user/signup | Register a new user | 201 |
| POST | /api/v1/user/login | Log in using username or email | 200 |

### Employee Management

| Method | Endpoint | Description | Success Status |
|--------|----------|-------------|----------------|
| GET | /api/v1/emp/employees | Get all employees owned by the user | 200 |
| POST | /api/v1/emp/employees | Create a new employee | 201 |
| GET | /api/v1/emp/employees/:eid | Get an employee by ID | 200 |
| PUT | /api/v1/emp/employees/:eid | Update an employee | 200 |
| DELETE | /api/v1/emp/employees?eid=xxx | Delete an employee | 204 |

### Health Check

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | /health | Check if the API is running | 200 |

All employee endpoints require JWT authentication.


## 7. Authentication and Authorization

Users can register with a username, email, and password. Passwords are hashed using bcrypt before being stored in MongoDB.

Users can log in with either their username or email. After a successful login, the API generates a JWT that expires after one hour.

Protected employee endpoints require the JWT in the Authorization header:

Authorization: Bearer <token>

Each employee is linked to the user who created it through a MongoDB ObjectId reference.

The API uses the authenticated user's ID to ensure users can only view, update, or delete their own employees. Attempts to access another user's employee return 404 Not Found.

## 8. Security and Error Handling

The application includes several security features:

- **Password Hashing:** bcrypt securely hashes passwords before storing them.
- **JWT Authentication:** Protects employee endpoints and verifies logged in users.
- **Authorization:** Users can only manage employees they created.
- **Helmet:** Adds security related HTTP headers.
- **Rate Limiting:** Limits authentication requests to 5 per 15 minutes and general API requests to 100 per 15 minutes. Exceeding these limits returns HTTP 429.
- **Input Validation:** Checks required fields, email formats, passwords, employee IDs, salaries, and dates.
- **Environment Variables:** Keeps database configuration and JWT secrets outside the source code.

The application uses centralized error handling to return consistent JSON responses.

Common HTTP status codes include:

| Status | Meaning |
|--------|---------|
| 200 | Successful request |
| 201 | Resource created |
| 204 | Resource deleted |
| 400 | Invalid request |
| 401 | Missing or invalid authentication |
| 403 | Forbidden access |
| 404 | Resource or route not found |
| 409 | Duplicate user |
| 429 | Too many requests |
| 500 | Internal server error |

Unauthorized employee access returns 404 to avoid revealing whether another user's employee exists.

## 9. Application Logging

The application uses Morgan and Winston to record server activity.

Logs are stored locally in the `logs/` directory:

- `combined.log` - Records API requests, server startup, authentication attempts, validation failures, and authorization failures.
- `error.log` - Records application errors.

Log entries include timestamps, HTTP methods, request paths, response status codes, and relevant event messages.

Sensitive information such as passwords, JWT tokens, and database credentials is not intentionally recorded in application logs.

Generated log files are excluded from GitHub using `.gitignore`. Screenshots of the logging functionality are included as evidence.

## 10. Health Check

The API includes a health check endpoint to confirm that the server is running.

**Endpoint:** GET /health

**URL:** http://localhost:3000/health

Expected response (200 OK):

```json
{
  "status": "OK",
  "message": "COMP3123 Assignment 1 API is running"
}
```

The health check can be tested using Postman or a web browser.

## 11. API Testing

The API was tested using Postman. The collection includes successful requests, validation errors, authentication failures, and authorization tests.

Tests include:

- User signup and login using username or email
- Employee creation, retrieval, updating, and deletion
- Invalid emails, passwords, salaries, dates, and employee IDs
- Missing and invalid JWT tokens
- Duplicate user registration
- Rate limiting (HTTP 429)
- Access restrictions between two different users
- Error handling and health checks

To test the API:

1. Start MongoDB and the Express server.
2. Import the included Postman collection.
3. Register a test user and log in.
4. Copy the returned JWT into a Postman environment variable named `jwt_token`.
5. Set protected requests to use Bearer Token `{{jwt_token}}`.
6. Send requests and check their HTTP status codes and JSON responses.

### Sample Test Credentials

The following accounts are used for testing:

| Username | Email | Password |
|----------|-------|----------|
| testuser3 | testuser3@example.com | Password123 |
| testuserB | testuserb@example.com | Password456 |

These are test-only credentials. If the database is empty, register the users first through the signup endpoint.

Screenshots of API tests, MongoDB records, and security features are included in the `Proof/` folder.





