# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack microservices-based AI fitness application featuring:
- **Backend**: Spring Boot 4.0.6 microservices with Java 21
- **Frontend**: React 19 with Vite, Redux state management, and Material-UI
- **Architecture**: Service-oriented backend with OAuth2/Keycloak authentication for both frontend and APIs

## Technology Stack

### Backend
- **Framework**: Spring Boot 4.0.6
- **Java Version**: 21
- **Build Tool**: Maven
- **Databases**: 
  - PostgreSQL (port 5433) - for user-service
  - MongoDB (port 27017) - for activity-service and ai-service
- **ORM**: Spring Data JPA with Hibernate (PostgreSQL), Spring Data MongoDB (MongoDB)
- **Service Discovery**: Eureka Server (port 8761)
- **API Gateway**: Spring Cloud Gateway (port 9090) with OAuth2 JWT authentication
- **Configuration Server**: Spring Cloud Config Server (port 8888)
- **Authentication**: Keycloak (port 8181) for OAuth2/OIDC identity and access management
- **Message Broker**: Apache Kafka (port 9092) - for inter-service communication
- **AI Integration**: Google Gemini API - for activity recommendations
- **HTTP Client**: Spring WebFlux WebClient with @LoadBalanced for service discovery
- **Validation**: Jakarta Validation
- **Code Generation**: Lombok
- **JWT Parsing**: Nimbus JOSE + JWT for token parsing and validation

### Frontend
- **Framework**: React 19.2.6 with Vite 8.0.12 (build tool)
- **State Management**: Redux 5.0.1 + Redux Toolkit 2.12.0
- **UI Library**: Material-UI (MUI) 9.2.0 with Emotion styling
- **HTTP Client**: Axios 1.19.0
- **Authentication**: react-oauth2-code-pkce 1.24.0 (OAuth2 PKCE flow)
- **Routing**: React Router 8.3.0
- **Linting**: ESLint with React-specific rules
- **Dev Server**: Vite with HMR (port 5173)
- **Development**: Node.js 18+ with npm

## Project Structure

```
ai-fitness-microservices/
├── backend/                # Spring Boot microservices
│   ├── eureka-server/      # Service discovery server (port 8761)
│   ├── Config-Server/      # Centralized configuration (port 8888)
│   ├── api-gateway/        # API Gateway (port 9090) with OAuth2 security
│   ├── user-service/       # User management (port 8081, PostgreSQL)
│   ├── activity-service/   # Activity tracking (port 8082, MongoDB)
│   └── AI-Service/         # AI recommendations (port 8083, MongoDB, Kafka consumer)
│
├── frontend/               # React frontend application
│   └── ai-fitness-frontend/
│       ├── public/         # Static assets (favicon.svg, icons.svg)
│       ├── src/
│       │   ├── App.jsx         # Main app component with routing
│       │   ├── authConfig.js   # Keycloak OAuth2 PKCE configuration
│       │   ├── main.jsx        # React entry point
│       │   ├── index.css       # Global styles
│       │   ├── App.css         # App-specific styles
│       │   ├── components/     # Reusable React components
│       │   │   ├── ActivityForm.jsx    # Form to log activities
│       │   │   ├── ActivityList.jsx    # Display user activities
│       │   │   └── ActivityDetail.jsx  # Individual activity view
│       │   ├── services/       # API client layer
│       │   │   └── api.js      # Axios instance with gateway base URL
│       │   └── store/          # Redux state management
│       │       ├── store.js    # Redux store configuration
│       │       └── authSlice.js    # Authentication state slice
│       ├── .eslintrc.cjs   # ESLint configuration
│       ├── vite.config.js  # Vite build configuration
│       ├── package.json    # Frontend dependencies
│       └── README.md       # Frontend setup guide
│
└── CLAUDE.md, README.md    # Project documentation
```

## Development Commands

### Backend Build and Test

```bash
# Build any service (replace {service} with: api-gateway, user-service, activity-service, AI-Service, Config-Server, or eureka-server)
cd backend/{service} && ./mvnw clean install

# Run tests
cd backend/{service} && ./mvnw test

# Run tests for a specific class
cd backend/{service} && ./mvnw test -Dtest=ClassName

# Run a specific test method
cd backend/{service} && ./mvnw test -Dtest=ClassName#methodName

# Compile and check for errors
cd backend/{service} && ./mvnw compile

# Clean build artifacts
cd backend/{service} && ./mvnw clean
```

### Frontend Build and Development

```bash
# Navigate to frontend directory
cd frontend/ai-fitness-frontend

# Install dependencies
npm install

# Start dev server (Vite HMR on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint

# Run ESLint with auto-fix
npm run lint -- --fix
```

### Running the Backend Services

**Service startup order (critical)**:
1. **Config Server** — required for centralized configuration
2. **Eureka Server** — required for service discovery
3. **User Service** — loads config from config-server
4. **Activity Service** — loads config from config-server
5. **AI Service** — loads config from config-server, requires GEMINI_API_KEY
6. **API Gateway** — optional entry point (direct service access still works)

```bash
cd backend

# Terminal 1: Config Server (port 8888)
cd Config-Server && ./mvnw spring-boot:run

# Terminal 2: Eureka Server (port 8761)
cd eureka-server && ./mvnw spring-boot:run

# Terminal 3: User Service (port 8081)
cd user-service && ./mvnw spring-boot:run

# Terminal 4: Activity Service (port 8082)
cd activity-service && ./mvnw spring-boot:run

# Terminal 5: AI Service (port 8083) - set environment variable first
export GEMINI_API_KEY="your-gemini-api-key"
cd AI-Service && ./mvnw spring-boot:run

# Terminal 6: API Gateway (port 9090)
cd api-gateway && ./mvnw spring-boot:run
```

### Running the Frontend

```bash
cd frontend/ai-fitness-frontend

# Dev server with HMR (http://localhost:5173)
npm run dev

# Build production bundle
npm run build

# Test the production build locally
npm run preview
```

## Frontend Architecture

### React + Vite Setup
- **Framework**: React 19.2 with Vite 8 build tool
- **UI Library**: Material-UI (MUI) v9
- **State Management**: Redux with Redux Toolkit
- **HTTP Client**: Axios with centralized configuration
- **Authentication**: OAuth2 PKCE flow via `react-oauth2-code-pkce`
- **Routing**: React Router v8
- **Dev Server**: Vite with HMR (port 5173)

### Authentication Flow (Frontend)
1. User logs in via Keycloak OAuth2 PKCE flow using `react-oauth2-code-pkce` component wrapper
2. OAuth2 provider returns access token (JWT)
3. Token stored in Redux `authSlice.js`
4. Axios instance in `services/api.js` automatically adds `Authorization: Bearer <token>` header to all requests
5. Requests routed through API Gateway (http://localhost:9090)

### State Management
- **Redux Store** (`store/store.js`): Central store with `authSlice`
- **Auth Slice** (`store/authSlice.js`): Handles login state, user info, token storage
- **API Service** (`services/api.js`): Axios instance reads token from Redux state for requests

### Component Structure
- **ActivityForm.jsx**: Controlled form component for logging new activities (POST to `/api/activities/track`)
- **ActivityList.jsx**: Displays paginated list of user activities (GET from `/api/activities/user/{userId}`)
- **ActivityDetail.jsx**: Shows details of a single activity (GET from `/api/activities/{activityId}`)

## Database Setup

### PostgreSQL (for user-service)

The application requires a PostgreSQL database running on port 5433 with:
- Database name: `microservice_ai_fitness`
- Username: `postgres`
- Password: `1234`

To set up the database:
```bash
# Using Docker
docker run --name ai-fitness-postgres -e POSTGRES_PASSWORD=1234 -e POSTGRES_DB=microservice_ai_fitness -p 5433:5432 -d postgres

# Or manually create the database in your local PostgreSQL instance
psql -U postgres -p 5433 -c "CREATE DATABASE microservice_ai_fitness;"
```

Hibernate DDL is set to `update`, so tables will be created/updated automatically on application startup.

### MongoDB (for activity-service and ai-service)

MongoDB is used for activity tracking and AI recommendations. Services use centralized configuration from Config Server:

**activity-service** (`config-server/src/main/resources/config/activity-service.yml`):
```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/aiactivityfitness
      database: aiactivityfitness
```

**ai-service** (inherits MongoDB config from activity-service.yml):
- Uses same MongoDB connection for consistency
- Database: `aiactivityfitness`

To set up MongoDB locally:
```bash
# Using Docker
docker run --name ai-fitness-mongo -d -p 27017:27017 mongo

# Or install MongoDB locally and ensure it's running on port 27017
```

### Apache Kafka (for inter-service communication)

Kafka is used for asynchronous messaging between services. Configure in `application.yaml`:
```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
    consumer:
      group-id: {service-specific-group-id}
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer

app:
  kafka:
    topic:
      name: activity-fitness
```

To set up Kafka locally:
```bash
# Using Docker
docker run --name ai-fitness-kafka -d -p 9092:9092 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 -e KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=PLAINTEXT:PLAINTEXT -e KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT confluentinc/cp-kafka

# Or use docker-compose for Kafka + Zookeeper setup
```

## Architecture Patterns

### Entity Layer
- Entities use Lombok annotations (`@Getter`, `@Setter`, `@AllArgsConstructor`, `@NoArgsConstructor`)
- UUIDs are used as primary keys (generated via `GenerationType.UUID`)
- Timestamp fields use `@CreationTimestamp` and `@UpdateTimestamp`
- Enums are stored as strings (`@Enumerated(EnumType.STRING)`)

### DTO Pattern
- Request DTOs use Jakarta validation annotations (`@NotBlank`, `@Email`, `@Size`)
- Response DTOs expose necessary fields and exclude sensitive data where appropriate
- Manual mapping between entities and DTOs (no MapStruct or ModelMapper yet)

### Service Layer
- Services use constructor injection via Lombok's `@RequiredArgsConstructor`
- Exception handling currently uses `RuntimeException` (consider implementing custom exceptions)

### Controller Layer
- REST endpoints follow `/api/{resource}` pattern
- Controllers use constructor injection
- Request validation via `@Valid` annotation
- Standard HTTP status codes (201 for creation, 200 for retrieval)

## API Endpoints

### Eureka Server (port 8761)

- Dashboard: `http://localhost:8761`
- Used for service discovery and registration by other microservices

### Config Server (port 8888)

- Dashboard: `http://localhost:8888`
- Provides centralized configuration for all microservices
- Configuration files stored in `config-server/src/main/resources/config/`

### API Gateway (port 9090)

- Entry point for all API requests
- **OAuth2 JWT Authentication**: All requests are authenticated using OAuth2 resource server with JWT tokens from Keycloak
- **Keycloak User Sync**: `KeycloakUserSyncFilter` intercepts authenticated requests and:
  - Extracts JWT token and user details (email, firstName, lastName, keycloakId)
  - Validates user existence in user-service via REST call
  - Auto-registers new Keycloak users in the system
  - Adds `X-USER-ID` header to requests for downstream services
- Routes requests to appropriate microservices using load-balanced Eureka discovery
- Routes configured in `config-server/src/main/resources/config/api-gateway-service.yml`
- Security configured in `api-gateway/src/main/java/com/sadcodes/apigateway/config/SecurityConfig.java`

**Security Configuration:**
- JWT validation against Keycloak JWKS endpoint: `http://localhost:8181/realms/fitness-app/protocol/openid-connect/certs`
- CSRF protection disabled (stateless REST API)
- All routes except `/eureka/**` require authentication
- Uses Spring Security with `@EnableWebFluxSecurity` for reactive security

**Gateway Routes:**
- `/api/users/**` → USER-SERVICE (port 8081)
- `/api/activities/**` → ACTIVITY-SERVICE (port 8082)
- `/api/recommendations/**` → AI-SERVICE (port 8083)
- `/eureka/**` → Eureka Server (publicly accessible)

### User Service (port 8081)

- `POST /api/users/register` - Register a new user (called by API Gateway during user sync)
  - Request: `RegisterRequest` (email, password, firstName, lastName, keycloakId)
  - Response: `UserResponse` (includes keycloakId field) with 201 Created
  - Note: keycloakId field links database user to Keycloak identity

- `GET /api/users/{userId}` - Get user profile by ID
  - Response: `UserResponse` with 200 OK

- `GET /api/users/validate/{keycloakId}` - Validate if user exists (internal, used by gateway)
  - Response: boolean indicating if user exists
  
**User Entity Updates:**
- Added `keycloakId` field to link Keycloak users with database records
- Password is auto-set to "12345" during Keycloak sync (can be updated later)

### Activity Service (port 8082)

- `POST /api/activities/track` - Track a new activity
  - Request: `ActivityRequest` (userId, activityType, duration, calories, timestamp)
  - Response: `ActivityResponse` with 201 Created
  - Publishes activity event to Kafka topic `activity-fitness` for AI processing

- `GET /api/activities/user/{userId}` - Get activities for a user
  - Query params: `limit`, `offset` (pagination)
  - Response: List of `ActivityResponse` with 200 OK
  - Requires authentication header with Keycloak JWT token

- `GET /api/activities/{activityId}` - Get a specific activity
  - Response: `ActivityResponse` with 200 OK
  - Requires authentication header with Keycloak JWT token

### AI Service (port 8083)

- Consumes activity events from Kafka topic `activity-fitness`
- Processes activities through `ActivityMessageListener` for AI-powered recommendations
- Uses Google Gemini API to generate personalized fitness recommendations
  - Requires `GEMINI_API_KEY` environment variable
  - API responses include: analysis, improvements, suggestions, safety information
- Stores activity data and recommendation data in MongoDB (`airecommendationfitness` database)
- Recommendations are persisted using the `Recommendation` model

**Available Endpoints:**
- `GET /api/recommendations/user/{userId}` - Get recommendations for a user
  - Response: List of AI-generated recommendations with 200 OK
- `POST /api/recommendations` - Create new recommendations (typically called by message listener)
  - Requires authentication header with Keycloak JWT token

## API Gateway Architecture

### Security Configuration (SecurityConfig.java)
- **Spring Security WebFlux**: Uses reactive security with `@EnableWebFluxSecurity`
- **OAuth2 Resource Server**: Configured to validate JWT tokens via Keycloak
- **Authorization Rules**:
  - Public routes: `/eureka/**` (permit all, no authentication required)
  - Protected routes: All other paths require authentication
- **CSRF Protection**: Disabled for REST API (stateless)
- **JWT Validation**: Automatic via Spring Security, validates against Keycloak JWKS endpoint

### User Sync Filter (KeycloakUserSyncFilter.java)
**Flow**:
1. Intercepts all incoming requests via `WebFilter` interface
2. Extracts JWT token from `Authorization` header
3. Parses JWT using Nimbus JOSE+JWT to extract claims:
   - `sub` → keycloakId
   - `email` → user email
   - `given_name` → firstName
   - `family_name` → lastName
4. Checks if user exists in database via user-service
5. If not exists, auto-registers user with RegisterRequest
6. Adds `X-USER-ID` header to request for downstream services

**Error Handling**: Falls through to standard filter chain if parsing fails

### WebClient Configuration (WebClientConfig.java)
- **@LoadBalanced WebClient.Builder**: Enables Eureka service discovery
- **Bean**: `userServiceWebClient` with base URL `http://USER-SERVICE`
- **Used by**: `UserService` class for REST calls to user-service
- **Service Discovery**: Automatically resolves `USER-SERVICE` name to actual service instance via Eureka

### Gateway Port
- Updated from 8080 to **9090** to avoid conflicts with local development environments
- Configured in: `config-server/src/main/resources/config/api-gateway-service.yml`

## Frontend Patterns and Guidelines

### React Component Structure
- Components are placed in `src/components/` with JSX extension
- Components are functional and use React hooks
- Props are destructured in function parameters
- Event handlers use camelCase naming (e.g., `handleSubmit`, `onClick`)
- Controlled components manage state via React hooks for forms

### Redux State Structure
- Slices defined in `src/store/` using Redux Toolkit `createSlice`
- State organized by domain (e.g., `authSlice`, future `activitySlice`, `recommendationSlice`)
- Async operations use Redux Toolkit `createAsyncThunk` (not yet implemented)
- Selectors created with `reselect` pattern when needed for performance

### API Integration
- All API calls go through `src/services/api.js` (Axios instance)
- Base URL points to API Gateway: `http://localhost:9090`
- JWT token added automatically to all requests via interceptor
- Request/response error handling should be consistent across components
- API service imports in components to avoid direct fetch/axios calls

### Authentication Patterns
- Login state managed in Redux `authSlice`
- Protected routes wrap components that require authentication
- Keycloak PKCE flow handled by `react-oauth2-code-pkce` library
- Token automatically included in all API requests via Axios interceptor

### Styling
- Global styles in `src/index.css`
- Component-specific styles in `src/App.css` or separate CSS files
- Material-UI components used for consistency and faster development
- Emotion (styled-components alternative) integrated via MUI

## Common Patterns

### Adding a New Microservice

1. Create service directory at root level
2. Use Spring Boot 4.0.6 with Java 21
3. Follow package structure: `com.sadcodes.{service-name}`
4. Include standard layers: entity, dto, repository, service, controller
5. Configure database connection in `application.yaml`
6. Add appropriate Maven dependencies in `pom.xml`

### Adding a New Entity

1. Create entity class in `entity/` package
2. Use Lombok annotations for boilerplate code
3. Add JPA annotations (`@Entity`, `@Table`, `@Id`, etc.)
4. Include `@CreationTimestamp` and `@UpdateTimestamp` for audit fields
5. Create corresponding repository interface extending `JpaRepository`

### Adding a New API Endpoint

1. Create request/response DTOs in `dto/` package with validation
2. Add service method in the service layer
3. Create controller method with appropriate HTTP method annotation
4. Return `ResponseEntity` with appropriate status code

### Adding a Frontend Feature

1. Create new component in `src/components/` with JSX extension
2. Import and use Material-UI components for UI
3. Create API service function in `src/services/api.js` if needed
4. Dispatch Redux actions if state needs to be shared across components
5. Add React Router route in `src/App.jsx` if it's a new page
6. Test the component by running `npm run dev` and checking the browser

## Testing and Development Notes

### Frontend Development
- Vite dev server includes HMR (Hot Module Replacement) — changes save automatically
- Keycloak login is **required** to access protected routes (enforced in `App.jsx`)
- Redux DevTools can be used for debugging state changes in browser
- API requests include `Authorization: Bearer <token>` header automatically via `api.js` interceptor
- `localhost:5173` for frontend, `localhost:9090` for API Gateway (CORS configured in gateway)

### Testing Authenticated Backend Endpoints
All endpoints accessed through the API Gateway (except `/eureka/**`) require a valid Keycloak JWT token in the `Authorization: Bearer <token>` header.

**Without token**: Requests will receive 401 Unauthorized
**With expired token**: Requests will receive 401 Unauthorized
**With valid token**: Keycloak user is auto-synced, request processed, `X-USER-ID` header added

### Direct Service Access (Bypassing Gateway)
Services can be accessed directly on their individual ports (8081, 8082, 8083) without authentication for development/testing. However, in production, all traffic should route through the gateway for consistent authentication and user sync.

### Kafka Topic Configuration
- Ensure Kafka is running and accessible at `localhost:9092` before starting activity-service
- Check Kafka topic `activity-fitness` exists or allow auto-creation
- Monitor with: `kafka-console-consumer --bootstrap-server localhost:9092 --topic activity-fitness --from-beginning`

### Database Connections
- PostgreSQL must be running on port 5433 with database `microservice_ai_fitness`
- MongoDB must be running on port 27017 with collections auto-created on first insert
- Verify connections in service logs during startup

### Frontend with Backend Integration
1. Start all backend services (Config Server → Eureka → Microservices → Gateway)
2. Configure Keycloak realm and create test users
3. Update `authConfig.js` with correct Keycloak realm and client credentials if needed
4. Run frontend dev server: `npm run dev` from `frontend/ai-fitness-frontend/`
5. Navigate to `http://localhost:5173` and authenticate via Keycloak
6. Frontend will call gateway endpoints on `http://localhost:9090` with JWT token

## Service Communication

### Authentication & Authorization
- **OAuth2 JWT**: API Gateway enforces OAuth2 authentication on all routes (except `/eureka/**`)
- **Token Validation**: JWT tokens are validated against Keycloak's JWKS endpoint
- **User Sync**: `KeycloakUserSyncFilter` automatically synchronizes Keycloak users to the database
- **Service Discovery Integration**: Keycloak users are linked to database users via `keycloakId` field
- **Downstream Headers**: Gateway adds `X-USER-ID` header to requests for downstream service communication

### Service Discovery
- Services register with Eureka Server on startup
- Services discover each other through Eureka for inter-service communication
- Environment variable `EUREKA_SERVER_URL` can override default Eureka location
- Gateway uses load balancing (`lb://SERVICE-NAME`) to route to registered services
- `@LoadBalanced` WebClient in gateway enables service discovery for user-service REST calls

### Centralized Configuration
- Config Server provides centralized configuration management
- Services pull configuration on startup via `spring.config.import` property
- Config files located in `config-server/src/main/resources/config/`
- Service-specific configurations:
  - `user-service.yml` - PostgreSQL connection, Eureka settings
  - `activity-service.yml` - MongoDB URI, Kafka topics, Eureka settings
  - `ai-service.yml` - Inherits activity-service config, additional AI settings
  - `api-gateway-service.yml` - Route definitions, OAuth2 JWKS endpoint, port 9090

### Inter-Service Messaging
- **Activity Service → AI Service**: Activity events are published to Kafka topic `activity-fitness`
- **AI Service Listener**: `ActivityMessageListener` consumes activity events for processing recommendations via Google Gemini API
- **Kafka Configuration**: 
  - activity-service acts as producer (sends activity events)
  - ai-service acts as consumer (processes activity events in group `activity-process-group`)
  - Topic: `activity-fitness`
  - Serialization: JSON format with type headers disabled
  - Bootstrap servers: `localhost:9092`

### Gateway to User-Service Communication
- **WebClient**: Uses `@LoadBalanced WebClient.Builder` for service discovery-aware HTTP calls
- **Purpose**: Validate user existence and register new Keycloak users during request interception
- **Base URL**: `http://USER-SERVICE` (resolved via Eureka)
- **Called by**: `KeycloakUserSyncFilter` during request processing

### AI Integration
- **Service**: `ActivityMessageListener` (Kafka consumer)
- **AI Provider**: Google Gemini API
- **Process**: 
  1. Activity event received from `activity-events` topic
  2. Activity data formatted as prompt for Gemini API
  3. AI generates personalized fitness recommendations
  4. Recommendations persisted to MongoDB via `Recommendation` model
  5. `ActivityAiService` handles service-layer logic
- **Note**: Requires `GEMINI_API_KEY` environment variable

## Keycloak Integration

### Keycloak Server (port 8181)
- **Realm**: `fitness-app`
- **Purpose**: OAuth2/OIDC identity provider for the entire application
- **User Sync Flow**: When an authenticated Keycloak user makes a request to the API Gateway:
  1. JWT token is validated against Keycloak's JWKS endpoint
  2. `KeycloakUserSyncFilter` extracts user claims (email, firstName, lastName, keycloakId)
  3. Gateway calls user-service to check if user exists in database
  4. If not, user is auto-registered with keycloakId linking to Keycloak identity
  5. Subsequent requests include `X-USER-ID` header for service-to-service communication

### JWT Token Claims
- **sub**: Keycloak user ID (mapped to keycloakId in database)
- **email**: User's email address
- **given_name**: User's first name
- **family_name**: User's last name

### Configuration
- JWKS endpoint: `http://localhost:8181/realms/fitness-app/protocol/openid-connect/certs`
- Configured in: `config-server/src/main/resources/config/api-gateway-service.yml`
- Token validation happens automatically via Spring Security OAuth2 Resource Server

## Kafka Topics

| Topic | Producer | Consumer(s) | Format | Purpose |
|-------|----------|------------|--------|---------|
| `activity-fitness` | activity-service | ai-service | JSON (Activity model) | Publish activity events for AI recommendations |

## Configuration Notes

### YAML Configuration Standards
- MongoDB uses URI format in centralized config: `mongodb://host:port/database`
- Kafka properties use lowercase with hyphens (kebab-case): `key-serializer`, `value-serializer`
- Kafka consumer group IDs are service-specific to avoid message conflicts
- Jackson deserialization is configured to fail on unknown properties: `false` for flexibility
- Services import configuration from Config Server via: `spring.config.import: optional:configserver:http://localhost:8888`
- Gateway uses load balancing prefix `lb://` for dynamic service discovery: `uri: lb://SERVICE-NAME`

### Config Server
- Located at `config-server/src/main/resources/config/`
- Uses native profile to load YAML files from classpath
- Port: 8888
- All microservices pull configuration from this server on startup

## Completed Features

### Backend
- ✅ API Gateway (Spring Cloud Gateway) - routes requests to microservices
- ✅ OAuth2 JWT Authentication with Keycloak integration
- ✅ Keycloak User Synchronization Filter - auto-registers Keycloak users to database
- ✅ Centralized Configuration Server (Spring Cloud Config Server)
- ✅ Service Discovery with Eureka and Load Balancing
- ✅ Kafka messaging for inter-service communication
- ✅ Google Gemini AI integration for personalized recommendations
- ✅ MongoDB persistence for recommendations and activities
- ✅ WebClient with @LoadBalanced for service-to-service communication

### Frontend
- ✅ React + Vite application with HMR
- ✅ Keycloak OAuth2 PKCE authentication
- ✅ Redux state management with auth persistence
- ✅ Material-UI components for professional UI
- ✅ Activity tracking form and list components
- ✅ API integration with centralized Axios client
- ✅ Protected routes requiring authentication

## Future Improvements to Consider

### Backend Improvements
- Implement global exception handling with `@ControllerAdvice`
- Enhance password management: use proper encryption (BCrypt) instead of hardcoded "12345"
- Implement DTO mapping library (MapStruct or ModelMapper)
- Add API documentation (SpringDoc OpenAPI with OAuth2 security scheme)
- Add logging framework configuration (SLF4J/Logback) with correlation IDs
- Add role-based authorization (RBAC) leveraging Keycloak roles in JWT claims
- Add circuit breaker pattern (Spring Cloud Circuit Breaker/Resilience4j) for user-service calls
- Add integration tests with Testcontainers (PostgreSQL, MongoDB, Kafka)
- Configure different profiles (dev, test, prod) with environment-specific Keycloak realms
- Add distributed tracing (Spring Cloud Sleuth + Zipkin) with JWT correlation
- Implement API rate limiting and throttling at gateway level
- Add error handling for Kafka message processing (dead-letter topics)
- Add health checks and monitoring endpoints (Spring Boot Actuator)
- Implement API versioning strategy with gateway route versioning
- Add refresh token support for long-lived sessions
- Implement user preference caching to reduce database lookups during sync

### Frontend Improvements
- Add TypeScript for type safety
- Implement error boundary components for better error handling
- Add loading states and skeleton screens during API calls
- Enhance form validation and user feedback
- Add unit tests with Vitest/React Testing Library
- Implement recommendations display component
- Add activity filtering/sorting capabilities
- Optimize Bundle size and lazy-load routes
- Add PWA capabilities for offline support
- Implement real-time updates via WebSocket for activity notifications
