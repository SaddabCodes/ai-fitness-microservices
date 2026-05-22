# AI Fitness Microservices

This repository contains a microservices-based AI fitness application. The project is currently in its early stage and includes the first service, `user-service`. Additional services will be added as the platform grows.

## Current Status

The repository currently contains:

- `user-service`: manages user registration and user profile retrieval

The architecture is organized so each service can evolve independently while remaining part of the same system.

## Tech Stack

- Java 21
- Spring Boot 4.0.6
- Spring Data JPA
- Spring Web MVC
- Jakarta Validation
- PostgreSQL
- Maven
- Lombok

As more microservices are introduced, they will be added at the repository root alongside `user-service`.

## Available Service

### user-service

Purpose:
Handles user-related operations such as registration and fetching a user profile.

Current endpoints:

- `POST /api/users/register`
- `GET /api/users/{userId}`

Main package:
`com.sadcodes.userservice`

## Prerequisites

Make sure the following are installed before running the project:

- Java 21
- Maven or use the included Maven Wrapper
- PostgreSQL

## Development Direction

This repository is intended to grow into a multi-service system. Future services may include domains such as:

- authentication
- workout planning
- nutrition tracking
- progress analytics
- AI recommendations

Each service should follow a consistent structure:

- dedicated Spring Boot application
- isolated domain logic
- own configuration and dependencies
- clear API boundaries
