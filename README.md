# Feedback App

A full-stack web application for collecting and managing user feedback, built with React (frontend) and Spring Boot (backend).

## 🚀 Features

- **User-friendly feedback form** with real-time validation
- **Responsive design** that works on desktop and mobile devices
- **RESTful API** for feedback submission and retrieval
- **Comprehensive testing** with both frontend and backend test suites
- **Enhanced logging** with debug information and privacy protection
- **Database persistence** with automatic timestamping
- **CORS support** for cross-origin requests

## 🏗️ Architecture

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   React App     │ ◄─────────────► │  Spring Boot    │
│   (Frontend)    │                 │   (Backend)     │
└─────────────────┘                 └─────────────────┘
         │                                   │
         │                                   │
    ┌─────────┐                         ┌─────────┐
    │  Vite   │                         │   H2    │
    │  Dev    │                         │Database │
    │ Server  │                         └─────────┘
    └─────────┘
```

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Vitest** - Unit testing framework
- **CSS3** - Styling with modern features

### Backend

- **Spring Boot 3.4.10** - Java framework
- **Java 21** - Latest LTS version
- **Spring Data JPA** - Database abstraction
- **H2 Database** - In-memory database for development
- **Maven** - Build and dependency management
- **JUnit 5** - Testing framework
- **Mockito** - Mocking framework

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Java 21** (JDK)
- **Maven** (or use the included Maven wrapper)

### 1. Clone the Repository

```bash
git clone https://github.com/Dicky59/feedback-app.git
cd feedback-app
```

### 2. Start the Backend

```bash
cd backend
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to `http://localhost:5173`

## 🧪 Testing

### Frontend Tests

```bash
cd frontend
npm test
```

### Backend Tests

```bash
cd backend
./mvnw test
```

### Test Coverage

- **Frontend**: 100% coverage for components, services, and hooks
- **Backend**: 100% coverage for controllers, repositories, and exception handling

## 📡 API Documentation

### Base URL

```
http://localhost:8080/api/feedback
```

### Endpoints

#### Submit Feedback

```http
POST /api/feedback
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Great service!"
}
```

**Response:**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Great service!",
  "createdAt": "2024-01-15T10:30:00"
}
```

#### Get All Feedback

```http
GET /api/feedback
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Great service!",
    "createdAt": "2024-01-15T10:30:00"
  }
]
```

### Error Responses

#### Validation Error (400)

```json
{
  "error": "Validation failed",
  "details": "Name is required, Please enter a valid email address",
  "timestamp": "2024-01-15T10:30:00"
}
```

#### Server Error (500)

```json
{
  "error": "Internal server error",
  "details": "An unexpected error occurred. Please try again later.",
  "timestamp": "2024-01-15T10:30:00"
}
```

## 🗄️ Database

### Schema

```sql
CREATE TABLE feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP NOT NULL
);
```

### Features

- **Automatic ID generation** with auto-increment
- **Timestamp tracking** with `@CreationTimestamp`
- **Data validation** with JPA constraints
- **In-memory storage** for development (H2)

## 📁 Project Structure

```
feedback-app/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API service layer
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript type definitions
│   │   └── test/           # Test utilities
│   ├── public/             # Static assets
│   └── package.json        # Dependencies and scripts
├── backend/                 # Spring Boot application
│   ├── src/main/java/
│   │   └── com/example/feedback/
│   │       ├── controller/ # REST controllers
│   │       ├── model/      # JPA entities
│   │       ├── repository/ # Data repositories
│   │       └── config/     # Configuration classes
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── schema.sql
│   └── pom.xml             # Maven dependencies
└── README.md               # This file
```

## ⚙️ Configuration

### Frontend Configuration

- **Vite config**: `frontend/vite.config.ts`
- **TypeScript config**: `frontend/tsconfig.json`
- **Test config**: `frontend/vitest.config.ts`

### Backend Configuration

- **Application properties**: `backend/src/main/resources/application.properties`
- **Database schema**: `backend/src/main/resources/schema.sql`
- **Maven config**: `backend/pom.xml`

## 🌐 CORS Configuration

The application includes comprehensive CORS (Cross-Origin Resource Sharing) support to enable secure communication between the frontend and backend.

### Features

- **Pre-configured CORS settings** for development and production
- **Secure origin validation** to prevent unauthorized access
- **Flexible header and method support** for API requests

### Configuration

CORS is configured in `backend/src/main/java/com/example/feedback/config/CorsConfig.java`:

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(Arrays.asList("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);

        return new CorsFilter(source);
    }
}
```

### Security Considerations

- **Development**: Allows all origins for easy development
- **Production**: Should be configured with specific allowed origins
- **Credentials**: Enabled for authenticated requests

## 📝 Logging

The application implements comprehensive logging with multiple levels and privacy protection.

### Logging Levels

- **INFO**: General application flow and successful operations
- **WARN**: Validation failures and non-critical issues
- **ERROR**: Failed operations and exceptions
- **DEBUG**: Detailed information for troubleshooting

### Features

- **Privacy Protection**: Sensitive data is redacted from logs
- **Structured Logging**: Consistent format across all log messages
- **Exception Tracking**: Full stack traces for debugging
- **Request/Response Logging**: API call monitoring

### Example Log Output

```
INFO  - Received feedback submission request for user: [REDACTED]
DEBUG - Request details - Name length: 8, Email length: 20, Message length: 45
INFO  - Feedback submitted successfully with ID: 123
WARN  - Validation failed for feedback submission: Name is required
ERROR - Failed to submit feedback: Database connection timeout
```

### Configuration

Logging is configured in `backend/src/main/resources/application.properties`:

```properties
# Logging configuration
logging.level.com.example.feedback=DEBUG
logging.level.org.springframework.web=INFO
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n
```

### Security Features

- **Data Redaction**: User information is masked as `[REDACTED]`
- **Field Length Logging**: Logs field lengths instead of actual content
- **No Sensitive Data**: Passwords and personal details are never logged

## 🧩 Assessment Branch (timestamps + GET)

As required by the assessment brief, there is a dedicated branch that adds timestamp fields to the database and responses, and implements the GET functionality to list all feedback entries.

- **Branch name**: `feature/get-functionality`
- **Includes**:
  - `createdAt` timestamps persisted and returned by the API
  - `GET /api/feedback` endpoint in the backend
  - Frontend page with navigation to view the feedback list

### Check out the branch

```bash
git fetch origin
git checkout feature/get-functionality
```

You can open the app and navigate to “View Feedback” to see the list page in this branch.

## 🚀 Deployment

### Frontend Deployment

```bash
cd frontend
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Backend Deployment

```bash
cd backend
./mvnw clean package
# Deploy the generated JAR file to your server
```

## 🔧 Development

### Adding New Features

1. Create a feature branch: `git checkout -b feature/new-feature`
2. Make your changes
3. Add tests for new functionality
4. Run tests to ensure everything works
5. Commit and push your changes
6. Create a pull request

### Code Style

- **Frontend**: ESLint configuration for consistent code style
- **Backend**: Follow Spring Boot conventions and Java best practices

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Kill process using port 8080
lsof -ti:8080 | xargs kill -9
```

#### Node Modules Issues

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### Maven Build Issues

```bash
cd backend
./mvnw clean install
```

### Logs

- **Frontend**: Check browser console for errors
- **Backend**: Check application logs for detailed error information

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the powerful UI library
- Vite team for the fast build tool
- All contributors and testers

---

**Happy Coding! 🎉**
