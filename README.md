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
