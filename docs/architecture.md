# Architecture Overview

## System Architecture

Rún is built with a modern client-server architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                        │
│                    Vite + TypeScript                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Pages: Home, Login, Dashboard, Courses, Exercises   │   │
│  │  Components: Header, ProtectedRoute                  │   │
│  │  Services: API Client (Axios)                        │   │
│  │  Context: Authentication                             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTP/REST API
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express)                        │
│                  Node.js + TypeScript                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes: Auth, Languages, Courses, Exercises        │   │
│  │  Middleware: CORS, Helmet, JWT Auth                 │   │
│  │  Services: Database queries                          │   │
│  │  Security: Password hashing, JWT tokens             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                      SQL Queries
                            │
┌─────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                       │
│                                                             │
│  Tables: users, user_profiles, languages, courses,          │
│          lessons, exercises, user_progress                 │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy
```
App
├── Header
│   └── Navigation (based on auth state)
├── Routes
│   ├── HomePage (public)
│   ├── LoginPage (public)
│   ├── RegisterPage (public)
│   ├── DashboardPage (protected)
│   ├── CoursesPage (protected)
│   ├── LessonPage (protected)
│   └── ExercisePage (protected)
└── AuthProvider (Context)
```

### State Management
- **Authentication**: React Context API (AuthContext)
- **API Communication**: Axios with interceptors
- **Component State**: React hooks (useState, useEffect)

### Key Components

#### AuthContext
- Manages user authentication state
- Persists token and user data to localStorage
- Provides login/logout functions
- Used by ProtectedRoute for access control

#### API Service
- Centralized axios instance
- Automatic JWT token injection
- Base URL configuration
- Service methods for each API resource

## Backend Architecture

### Routing Structure
```
/api
├── /auth
│   ├── POST /register
│   ├── POST /login
│   └── GET /profile/:userId
├── /languages
│   ├── GET / (all languages)
│   └── GET /:id (single language)
├── /courses
│   ├── GET /language/:languageId
│   ├── GET /:id
│   └── GET /:courseId/lessons
├── /exercises
│   ├── GET /lesson/:lessonId
│   ├── GET /:id
│   └── POST /:id/submit
└── /progress
    ├── GET /:userId
    └── GET /:userId/exercise/:exerciseId
```

### Middleware Stack
1. **Helmet** - Security headers
2. **CORS** - Cross-origin requests
3. **JSON Parser** - Request body parsing
4. **Auth Interceptor** - Token verification (on protected routes)

### Database Connection
- Connection pooling via pg Pool
- Error handling and reconnection logic
- Environment-based configuration

## Data Flow

### Authentication Flow
```
User Input (Login/Register)
        ↓
Frontend Form Component
        ↓
API Service (axios)
        ↓
Backend Route Handler
        ↓
Database Query (INSERT/SELECT)
        ↓
Password Hash/Verify (bcryptjs)
        ↓
JWT Token Generation
        ↓
Response with Token
        ↓
Frontend stores token + user (localStorage)
        ↓
AuthContext updated
        ↓
User redirected to Dashboard
```

### Exercise Submission Flow
```
User submits code
        ↓
Frontend Exercise Component
        ↓
API Service POST to /exercises/:id/submit
        ↓
Backend validates code
        ↓
Database: INSERT/UPDATE user_progress
        ↓
Return result (passed/failed, score)
        ↓
Frontend displays feedback
        ↓
User progress updated
```

## Security Considerations

### Frontend
- JWT tokens stored in localStorage
- Protected routes require authentication
- No sensitive data in localStorage
- HTTPS enforced in production

### Backend
- Password hashing with bcryptjs (10 salt rounds)
- JWT secret stored in environment variables
- CORS restricted to frontend domain
- Helmet security headers enabled
- SQL prepared statements (parameterized queries)

### Database
- User passwords hashed before storage
- Foreign key constraints enforce data integrity
- Unique constraints on email addresses
- Indexes on frequently queried columns

## Scalability Considerations

### Short Term
- Database connection pooling
- API response caching
- Frontend lazy loading

### Long Term
- Microservices architecture
- Message queue (Redis)
- Distributed caching
- Database replication
- Load balancing

## Performance Optimization

### Frontend
- Code splitting with React.lazy
- Image optimization
- CSS minification (Tailwind)
- Bundle analysis

### Backend
- Database query optimization
- Response compression (gzip)
- Caching strategies
- Rate limiting

---

For more details, see the main README.md
