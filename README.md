# Project Management System Backend API

A production-ready RESTful API for project management, team collaboration, task tracking, and role-based access control (RBAC).

Built with Node.js, Express.js, MongoDB, and Mongoose.

---

## Overview

Project Management System Backend API is a modular RESTful backend application designed to manage projects, teams, tasks, subtasks, and project notes within a secure collaborative environment.

The system follows a modular MVC architecture and provides authentication, authorization, validation, email verification, password recovery, file uploads, and project-based role management.

The API is designed with scalability and maintainability in mind, making it suitable as a foundation for real-world project management platforms.

---

## Features

### Authentication

- User Registration
- User Login
- User Logout
- JWT Authentication
- Refresh Token Authentication
- Email Verification
- Forgot Password
- Reset Password
- Change Password
- Current User Endpoint

### User Management

- User Profile Management
- Avatar Upload
- Password Hashing with bcrypt
- Email Verification

### Project Management

- Create Project
- Get Projects
- Get Project By ID
- Update Project
- Delete Project

### Team Management

- Add Members
- Remove Members
- Update Member Roles
- Get Project Members

Supported Roles

- Admin
- Project Admin
- Member

### Task Management

- Create Task
- Get Tasks
- Get Task Details
- Update Task
- Delete Task
- Assign Tasks
- Task Status Management
- File Attachments

### SubTask Management

- Create SubTask
- Update SubTask
- Delete SubTask
- Completion Tracking

### Project Notes

- Create Note
- Get Notes
- Get Note By ID
- Update Note
- Delete Note

### Email Service

- Email Verification
- Password Recovery
- Mailgen Email Templates
- Nodemailer Integration

### Security

- JWT Authentication
- Password Hashing
- Role-Based Access Control (RBAC)
- Protected Routes
- Request Validation
- Secure Environment Variables

### Validation

- Express Validator
- Request Validation Middleware
- MongoDB ObjectId Validation

### Database

- MongoDB
- Mongoose ODM
- Aggregation Pipelines
- Populate Relationships
- Schema Validation

---

## Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JSON Web Token (JWT)
- bcrypt

### Validation

- Express Validator

### Email

- Nodemailer
- Mailgen
- Mailtrap

### File Upload

- Multer

### Development Tools

- Git
- GitHub
- Postman

---

## Architecture

The project follows a modular MVC architecture designed to keep the codebase clean, scalable, and maintainable.

```
Client
   │
   ▼
Express Routes
   │
   ▼
Authentication Middleware
   │
   ▼
Authorization (RBAC)
   │
   ▼
Validation Middleware
   │
   ▼
Controllers
   │
   ▼
Mongoose Models
   │
   ▼
MongoDB
```

Project Structure

- Routes define the API endpoints.
- Middleware handles authentication, authorization, and request validation.
- Controllers contain the business logic.
- Models define the database schema.
- Validators validate incoming requests.
- Utilities provide reusable helper functions.

---

## Project Goals

The primary objective of this project is to demonstrate production-ready backend development practices by implementing:

- Modular REST API architecture
- JWT-based authentication
- Role-Based Access Control (RBAC)
- MongoDB data modeling
- Aggregation Pipelines
- Reusable middleware
- Request validation
- Clean and maintainable code structure
- Secure authentication and authorization workflows


---

# Project Structure

```
project-management-system-backend-api
│
├── public
│   └── images
│
├── src
│   ├── config
│   ├── controllers
│   ├── db
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── validators
│   ├── app.js
│   └── index.js
│
├── .env.example
├── package.json
└── README.md
```

## Folder Description

| Folder | Description |
|----------|-------------|
| config | Application configuration files |
| controllers | Business logic for API endpoints |
| db | MongoDB connection setup |
| middleware | Authentication, authorization, validation middleware |
| models | Mongoose database models |
| routes | API route definitions |
| utils | Helper functions and reusable utilities |
| validators | Request validation using Express Validator |
| public/images | Uploaded images |

---

# Database Models

The application is built around six main collections.

### User

Stores user account information.

Responsibilities

- Authentication
- Profile Management
- Email Verification
- Password Recovery

---

### Project

Represents a project created by a user.

Responsibilities

- Project Information
- Owner
- Team Collaboration

---

### Project Member

Acts as a bridge between users and projects.

Responsibilities

- Team Membership
- Role Management
- Project Permissions

Supported Roles

- Admin
- Project Admin
- Member

---

### Task

Represents a task that belongs to a project.

Responsibilities

- Task Assignment
- Status Tracking
- File Attachments

Supported Status

- Todo
- In Progress
- Done

---

### SubTask

Represents smaller work items belonging to a task.

Responsibilities

- Completion Tracking
- Task Breakdown

---

### Project Note

Stores notes related to a project.

Responsibilities

- Meeting Notes
- Documentation
- Project Updates

---

# Database Relationships

```
User
 │
 ├──────────────┐
 │              │
 │          Project
 │              │
 │              ├──────────────┐
 │              │              │
 │              │          Project Member
 │              │              │
 │              │              │
 │              │          User
 │              │
 │              ├─────────────── Task
 │              │                  │
 │              │                  │
 │              │              SubTask
 │              │
 │              └─────────────── Notes
```

---

# Authentication Flow

```
Register
     │
     ▼
Email Verification
     │
     ▼
Login
     │
     ▼
Generate Access Token
Generate Refresh Token
     │
     ▼
Access Protected Routes
     │
     ▼
Refresh Token (When Expired)
```

---

# Authorization (RBAC)

The application implements Role-Based Access Control to restrict access to protected resources.

| Role | Permissions |
|------|-------------|
| Admin | Full access to project resources |
| Project Admin | Manage project members, tasks, and notes |
| Member | Access assigned project resources |

Authorization is validated before protected endpoints are executed through reusable middleware.

---

# Installation

Clone the repository

```bash
git clone https://github.com/adel-engineer/project-management-backend.git
```

Move into the project directory

```bash
cd project-management-backend
```

Install dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the root directory.

```env
MONGO_URI=

PORT=

CORS_ORIGIN=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

MAILTRAP_SMTP_HOST=
MAILTRAP_SMTP_POST=
MAILTRAP_SMTP_USER=
MAILTRAP_SMTP_PASS=

FORGET_PASSWORD_URL=
```

---

# Running the Application

Development Mode

```bash
npm run dev
```

Production Mode

```bash
npm start
```

---

# API Base URL

```
http://localhost:3000/api/v1
```

All protected routes require a valid JWT Access Token.


---

# API Modules

The API is organized into multiple modules, each responsible for a specific feature of the system.

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/users/register` | Register a new user |
| POST | `/users/login` | Authenticate user |
| POST | `/users/logout` | Logout current user |
| POST | `/users/refresh-token` | Generate a new access token |
| GET | `/users/verify-email/:token` | Verify email address |
| POST | `/users/resend-email-verification` | Resend verification email |
| POST | `/users/forgot-password` | Send password reset email |
| POST | `/users/reset-password/:token` | Reset password |
| POST | `/users/change-password` | Change current password |
| GET | `/users/current-user` | Retrieve current authenticated user |

---

## Project Management

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/projects` | Create a new project |
| GET | `/projects` | Retrieve all projects |
| GET | `/projects/:projectId` | Retrieve project details |
| PUT | `/projects/:projectId` | Update project |
| DELETE | `/projects/:projectId` | Delete project |

---

## Project Members

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/projects/:projectId/members` | Add project member |
| GET | `/projects/:projectId/members` | Retrieve project members |
| PUT | `/projects/:projectId/members/:memberId` | Update member role |
| DELETE | `/projects/:projectId/members/:memberId` | Remove project member |

---

## Tasks

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/tasks/:projectId` | Create task |
| GET | `/tasks/:projectId` | Retrieve project tasks |
| GET | `/tasks/:projectId/t/:taskId` | Retrieve task details |
| PUT | `/tasks/:projectId/t/:taskId` | Update task |
| DELETE | `/tasks/:projectId/t/:taskId` | Delete task |

---

## SubTasks

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/tasks/:projectId/t/:taskId/subtasks` | Create subtask |
| PUT | `/tasks/:projectId/st/:subTaskId` | Update subtask |
| DELETE | `/tasks/:projectId/st/:subTaskId` | Delete subtask |

---

## Project Notes

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/notes/:projectId` | Create project note |
| GET | `/notes/:projectId` | Retrieve all project notes |
| GET | `/notes/:projectId/n/:noteId` | Retrieve note details |
| PUT | `/notes/:projectId/n/:noteId` | Update project note |
| DELETE | `/notes/:projectId/n/:noteId` | Delete project note |

---

# API Testing

The API can be tested using the included Postman Collection.

Import the provided collection into Postman and configure your environment variables before sending requests.

---

# Authentication

Protected endpoints require an Access Token.

Example header:

```http
Authorization: Bearer <your_access_token>
```

---

# Email Service

The application integrates email functionality using:

- Nodemailer
- Mailgen
- Mailtrap SMTP

Supported email workflows:

- Email Verification
- Password Reset
- Verification Email Resend

---

# File Uploads

The application supports multipart file uploads using Multer.

Supported uploads include:

- User Avatar
- Task Attachments

Uploaded files are stored inside the `public/images` directory.

---

# Error Handling

The project uses centralized error handling to provide consistent API responses.

Example:

```json
{
    "statusCode": 404,
    "message": "Project not found",
    "success": false
}
```

---

# API Response Format

Successful responses follow a consistent structure.

```json
{
    "statusCode": 200,
    "data": {},
    "message": "Success",
    "success": true
}
```

Error responses:

```json
{
    "statusCode": 400,
    "message": "Validation failed",
    "success": false
}
```

---

# Security Features

The application implements several security mechanisms:

- JWT Authentication
- Refresh Token Strategy
- Password Hashing with bcrypt
- Role-Based Access Control (RBAC)
- Request Validation
- Protected Routes
- Environment Variable Configuration

---

# MongoDB Features

The project utilizes several MongoDB capabilities including:

- Aggregation Pipelines
- Populate Relationships
- Schema Validation
- ObjectId References
- Timestamp Support
- Document Relationships
