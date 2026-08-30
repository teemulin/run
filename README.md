# Rún - Learn to Code

🚀 **Rún** is an interactive coding education platform with AI-assisted learning paths, real-time code execution, and personalized feedback.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Development](#development)
- [Testing](#testing)
- [Database](#database)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)
- [Future Roadmap](#future-roadmap)

## Features

✨ **Core Features**
- 🎓 Interactive coding exercises with real-time feedback
- 🧪 Test-driven learning with visible and hidden test cases
- 💾 Progress tracking and result history
- 🔒 Secure code execution in sandboxed environment
- 📊 Personalized learning paths
- 🎯 Multiple exercise types (coding, multiple choice)

🆕 **Exercise Engine MVP**
- ⚡ Instant code execution and validation
- 🛡️ Security validation (blocks eval, require, import, etc.)
- 📈 Detailed test results with expected vs actual output
- 🎨 Beautiful, responsive UI for code editing
- 💡 Hints and starter code templates

## Architecture

```
Frontend (React + TypeScript)
    ├── Pages (ExercisePage, Dashboard, etc.)
    ├── Components (CodeEditor, TestResults, etc.)
    └── Context (Auth, Theme)
            ↓
    API Layer (axios)
            ↓
Backend (Express + Node.js)
    ├── Routes (exercises, users, lessons)
    ├── Services (CodeExecutionService, etc.)
    ├── Middleware (auth, validation)
    └── Database Layer
            ↓
PostgreSQL Database
    ├── users
    ├── lessons
    ├── exercises (with test_cases JSONB)
    ├── user_progress
    └── test_results (NEW)
```

## Prerequisites

### Required
- **Node.js** 18 LTS or 20 LTS ([Download](https://nodejs.org/)) 
  - Recommended: Node 20 LTS (latest stable)
  - Minimum: Node 18 LTS
  - Check LTS schedule: [nodejs.org/en/about/releases/](https://nodejs.org/en/about/releases/)
- **PostgreSQL** 12+ ([Download](https://www.postgresql.org/download/))
- **npm** 9+ or **yarn** 3+ (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### Optional
- **Docker** & **Docker Compose** (for database setup)
- **Postman** or **Thunder Client** (for API testing)
- **Visual Studio Code** or **JetBrains IDEs**
- **nvm** (Node Version Manager) - for managing Node.js versions

### Verify Installation

```bash
# Check Node.js version (should be 18+ LTS or higher)
node --version

# Check npm version (should be 9+)
npm --version

# Check PostgreSQL version (should be 12+)
psql --version

# Optional: Check if NVM is installed
nvm --version
```

### Node.js LTS Information

| Version | Type  | Start      | End        | Status    |
|---------|-------|-----------|-----------|-----------|
| 20.x    | LTS   | 2023-10   | 2026-04   | **Current** ✅ |
| 18.x    | LTS   | 2022-10   | 2025-04   | Supported  |
| 16.x    | LTS   | 2021-10   | 2024-09   | EOL        |

**Recommendation:** Use Node 20 LTS for new installations.

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/teemulin/run.git
cd run
```

### 2. (Optional) Install Node.js with NVM

If you have multiple Node.js versions, use NVM:

```bash
# Install NVM (if not already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc

# Install Node 20 LTS
nvm install 20

# Use Node 20
nvm use 20

# Verify
node --version  # Should show v20.x.x
```

### 3. Database Setup

#### Option A: Using PostgreSQL Directly

```bash
# Create database
createdb run_db

# Connect to database
psql -d run_db

# Create database user (in psql terminal)
CREATE USER run_user WITH PASSWORD 'your_secure_password';
ALTER USER run_user CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE run_db TO run_user;

# Exit psql
\q

# Apply schema
psql -d run_db -U run_user -f backend/src/database/schema.sql

# Seed sample data
psql -d run_db -U run_user -f backend/src/database/seeds.sql
```

#### Option B: Using Docker (Recommended)

```bash
# Start PostgreSQL in Docker
docker run --name run-postgres \
  -e POSTGRES_DB=run_db \
  -e POSTGRES_USER=run_user \
  -e POSTGRES_PASSWORD=your_secure_password \
  -p 5432:5432 \
  -d postgres:14

# Wait 10 seconds for database to start
sleep 10

# Apply schema
psql -h localhost -U run_user -d run_db -f backend/src/database/schema.sql

# Seed data
psql -h localhost -U run_user -d run_db -f backend/src/database/seeds.sql
```

#### Option C: Using Docker Compose (Best for Development)

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    container_name: run-postgres
    environment:
      POSTGRES_DB: run_db
      POSTGRES_USER: run_user
      POSTGRES_PASSWORD: your_secure_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U run_user -d run_db"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

Then run:

```bash
# Start PostgreSQL
docker-compose up -d

# Wait for database to be ready
docker-compose exec postgres pg_isready -U run_user -d run_db

# Apply schema
psql -h localhost -U run_user -d run_db -f backend/src/database/schema.sql

# Seed data
psql -h localhost -U run_user -d run_db -f backend/src/database/seeds.sql
```

### 4. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://run_user:your_secure_password@localhost:5432/run_db
JWT_SECRET=your_jwt_secret_key_here_change_in_production
CORS_ORIGIN=http://localhost:5173
API_PORT=3000
EOF

# Verify .env file created
cat .env
```

### 5. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Rún
EOF

# Verify .env file created
cat .env
```

## Running the Application

### Start Backend Server

```bash
cd backend

# Development mode (with hot reload)
npm run dev

# Or production build
npm run build
npm start
```

**Expected output:**
```
✓ Backend server running on http://localhost:3000
✓ Connected to PostgreSQL database
```

### Start Frontend Development Server

In a **new terminal**:

```bash
cd frontend

# Development mode
npm run dev
```

**Expected output:**
```
  VITE v4.x.x  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Development

### Backend Development

```bash
cd backend

# Start dev server with hot reload
npm run dev

# Run linter
npm run lint

# Format code
npm run format
```

### Frontend Development

```bash
cd frontend

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/run_db

# Server
NODE_ENV=development
PORT=3000
API_PORT=3000

# Authentication
JWT_SECRET=your_super_secret_key_change_in_production

# CORS
CORS_ORIGIN=http://localhost:5173
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Rún
```

## Testing

### Run Backend Tests

```bash
cd backend

# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Run Frontend Tests

```bash
cd frontend

# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Exercise Engine

```bash
# 1. Start backend and frontend (as described above)

# 2. Run integration tests
cd backend
npm run test

# 3. Test API endpoints with curl
curl -X POST http://localhost:3000/api/exercises/1/run \
  -H "Content-Type: application/json" \
  -d '{"code": "return 42;", "userId": 1}'

# 4. Test in browser
# - Navigate to http://localhost:5173
# - Find an exercise
# - Click "Run Code" button
# - Submit and check results
```

## Database

### Database Schema

```bash
# View all tables
psql -d run_db -U run_user -c "\dt"

# View exercises table
psql -d run_db -U run_user -c "\d exercises"

# View test_results table
psql -d run_db -U run_user -c "\d test_results"

# View user_progress table
psql -d run_db -U run_user -c "\d user_progress"
```

### Sample Data

Sample exercises are included in `backend/src/database/seeds.sql`:
- Hello World
- Simple Addition
- Array Sum
- String Reverse

To verify seeding:

```bash
psql -d run_db -U run_user -c "SELECT id, title, type FROM exercises;"
```

### Database Migrations

To update schema:

```bash
# 1. Edit backend/src/database/schema.sql
# 2. Backup current database (recommended)
# 3. Apply changes
psql -d run_db -U run_user -f backend/src/database/schema.sql
```

## API Documentation

### Exercise Endpoints

#### Get Exercise
```bash
GET /api/exercises/:id
```

#### Get Exercises by Lesson
```bash
GET /api/exercises/lesson/:lessonId
```

#### Run Code (Preview)
```bash
POST /api/exercises/:exerciseId/run

Body:
{
  "code": "return 42;",
  "userId": 1
}

Response:
{
  "passedTests": 1,
  "failedTests": 0,
  "totalTests": 1,
  "results": [...],
  "visibleResults": [...],
  "executionTime": 45
}
```

#### Submit Solution
```bash
POST /api/exercises/:exerciseId/submit

Body:
{
  "code": "return 42;",
  "userId": 1
}

Response:
{
  "message": "Exercise submitted successfully",
  "passed": true,
  "score": 100,
  "feedback": "✅ Great job!",
  "testResults": {...}
}
```

#### Get Test Results
```bash
GET /api/exercises/:exerciseId/results/:userId
```

### Full API Documentation

See [API.md](docs/API.md) for complete API reference.

## Troubleshooting

### Node.js Version Issues

**Error:** `npm ERR! The engine "node" is incompatible`

```bash
# Check current Node version
node --version

# Update Node.js to LTS version
# Using NVM:
nvm install 20
nvm use 20

# Or download from: https://nodejs.org/
```

### Database Connection Issues

**Error:** `ECONNREFUSED 127.0.0.1:5432`

```bash
# Check if PostgreSQL is running
psql -U postgres -d postgres -c "SELECT version();"

# If using Docker:
docker ps | grep postgres

# Start Docker container if stopped:
docker start run-postgres

# If using Docker Compose:
docker-compose up -d
```

### Port Already in Use

**Error:** `Error: listen EADDRINUSE :::3000`

```bash
# Find and kill process using port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Node Modules Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### CORS Errors

**Error:** `Access to XMLHttpRequest blocked by CORS`

```bash
# Verify CORS_ORIGIN in backend/.env
CORS_ORIGIN=http://localhost:5173

# Restart backend server
```

### Database Schema Missing Tables

```bash
# Reapply schema
psql -d run_db -U run_user -f backend/src/database/schema.sql

# Reseed data
psql -d run_db -U run_user -f backend/src/database/seeds.sql
```

### Code Execution Fails

```bash
# Check if code validation is too strict
# Review backend/src/services/codeExecutor.ts

# Test with simple code:
# return 42;
```

## Project Structure

```
run/
├── backend/
│   ├── src/
│   │   ├── database/
│   │   │   ├── schema.sql          # Database schema
│   │   │   └── seeds.sql           # Sample data
│   │   ├── routes/
│   │   │   ├── exercises.ts        # Exercise endpoints
│   │   │   └── __tests__/          # API tests
│   │   ├── services/
│   │   │   ├── codeExecutor.ts     # Code execution engine
│   │   │   └── __tests__/          # Service tests
│   │   ├── middleware/
│   │   ├── app.ts                  # Express app setup
│   │   └── server.ts               # Server entry point
│   ├── .env                         # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CodeEditor.tsx      # Code input component
│   │   │   ├── TestResults.tsx     # Results display
│   │   │   └── __tests__/          # Component tests
│   │   ├── pages/
│   │   │   ├── ExercisePage.tsx    # Main exercise page
│   │   │   └── __tests__/          # Page tests
│   │   ├── context/
│   │   │   └── AuthContext.tsx     # Authentication
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env                         # Environment variables
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── docs/
│   ├── EXERCISE_ENGINE.md          # Exercise Engine guide
│   ├── MVP_COMPLETE.md             # MVP summary
│   └── API.md                       # API documentation
│
├── docker-compose.yml              # Docker setup (optional)
├── README.md                        # This file
└── .gitignore
```

## Future Roadmap

### Phase 2: Enterprise Edition 🏢
- [ ] Code Analysis Engine for analyzing company codebases
- [ ] Auto-generated exercise tracks based on org patterns
- [ ] Team progress dashboards
- [ ] Custom coding standards and rubrics
- [ ] Integration with GitHub/GitLab

### Phase 3: Advanced Features 🚀
- [ ] Python, Java, C++ code execution
- [ ] Real-time collaboration on exercises
- [ ] AI-powered hints and explanations
- [ ] Plagiarism detection
- [ ] Leaderboards and gamification
- [ ] Video explanations integration

### Phase 4: Scaling 📈
- [ ] WebSocket support for live feedback
- [ ] Worker processes for code execution
- [ ] Performance monitoring and analytics
- [ ] Mobile app
- [ ] API rate limiting and caching

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation in `/docs`
- Review API documentation
- Check troubleshooting section

## Quick Start Recap

```bash
# 1. Clone and setup Node 20 LTS
git clone https://github.com/teemulin/run.git && cd run
nvm install 20 && nvm use 20

# 2. Database (Docker Compose - Recommended)
docker-compose up -d
sleep 5
psql -h localhost -U run_user -d run_db -f backend/src/database/schema.sql
psql -h localhost -U run_user -d run_db -f backend/src/database/seeds.sql

# 3. Backend
cd backend && npm install
echo "DATABASE_URL=postgresql://run_user:your_secure_password@localhost:5432/run_db" > .env
echo "JWT_SECRET=dev_secret" >> .env
npm run dev

# 4. Frontend (new terminal)
cd frontend && npm install
npm run dev

# 5. Open browser
# http://localhost:5173
```

---

Made with ❤️ by Teemu Lindberg

Last updated: 2026-08-30
