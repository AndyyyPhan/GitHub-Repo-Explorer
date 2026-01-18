# 🔍 GitHub Repo Explorer

A modern fullstack application that allows users to search GitHub repositories by username, explore repository details, and save their favorites to a personal collection.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

<p align="center">
  <a href="https://git-hub-repo-explorer-beta.vercel.app">View Live Demo</a>
  ·
  <a href="https://github.com/AndyyyPhan/GitHub-Repo-Explorer/issues">Report Bug</a>
  ·
  <a href="https://github.com/AndyyyPhan/GitHub-Repo-Explorer/issues">Request Feature</a>
</p>

---

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Technical Decisions](#technical-decisions)
- [Future Improvements](#future-improvements)

---

## 🎯 About The Project

GitHub Repo Explorer is a fullstack TypeScript application that demonstrates modern web development practices. Users can search for any GitHub user's public repositories, view detailed information about each repo, and save their favorites to a personal dashboard.

### Key Highlights

- **Type-Safe**: End-to-end TypeScript implementation
- **Secure Authentication**: JWT-based auth with bcrypt password hashing
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **RESTful API**: Clean, well-structured backend endpoints
- **Real-time Feedback**: Loading states, error handling, and optimistic UI updates

---

## ✨ Features

### 🔐 Authentication
- User registration with email validation
- Secure login with JWT tokens
- Password strength requirements (uppercase, lowercase, numbers, 8+ characters)
- Persistent sessions via localStorage

### 🔎 Repository Search
- Search any GitHub user's public repositories
- View repository details: name, description, stars, language
- Results sorted by star count (most popular first)
- Direct links to GitHub repositories

### ❤️ Favorites Management
- Save repositories to personal collection
- Visual feedback with filled/outlined heart icons
- Remove favorites with one click
- Persistent storage across sessions

### 📱 User Experience
- Fully responsive design (mobile, tablet, desktop)
- Loading spinners for async operations
- Error messages with clear feedback
- Empty states with helpful guidance

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI library |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| React Router v6 | Navigation |
| Vite | Build tool |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express | Web framework |
| TypeScript | Type safety |
| JWT | Authentication |
| bcrypt | Password hashing |

### Database & Hosting
| Technology | Purpose |
|------------|---------|
| PostgreSQL | Database |
| Supabase | Database hosting |
| Vercel | Application hosting |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                        │
│                     Vercel: github-repo-explorer                │
├─────────────────────────────────────────────────────────────────┤
│  Pages          │  Components      │  Services                  │
│  ├─ Login       │  ├─ Navbar       │  └─ api.ts (fetch calls)   │
│  ├─ Register    │  ├─ RepoCard     │                            │
│  ├─ Search      │  └─ Protected    │  Context                   │
│  └─ Favorites   │     Route        │  └─ AuthContext            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Backend (Express)                        │
│                Vercel: github-repo-explorer-server              │
├─────────────────────────────────────────────────────────────────┤
│  Routes              │  Controllers       │  Middleware         │
│  ├─ /api/auth        │  ├─ authController │  └─ authMiddleware  │
│  │   ├─ POST /login  │  └─ meController   │     (JWT verify)    │
│  │   └─ POST /register                    │                     │
│  └─ /api/me          │                    │                     │
│      ├─ GET /favorites                    │                     │
│      ├─ POST /favorites                   │                     │
│      └─ DELETE /favorites/:id             │                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ SSL
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Database (PostgreSQL)                        │
│                          Supabase                               │
├─────────────────────────────────────────────────────────────────┤
│  Tables                                                         │
│  ├─ users (id, email, password, created_at)                     │
│  └─ favorites (id, user_id, repo_id, repo_name, repo_url,       │
│                description, language, stars_count, created_at)  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (or Supabase account)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AndyyyPhan/GitHub-Repo-Explorer.git
   cd GitHub-Repo-Explorer
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   ```

3. **Create server environment file**
   ```bash
   # server/.env
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   PORT=8000
   ```

4. **Set up the database**
   ```sql
   -- Run in your PostgreSQL client or Supabase SQL Editor
   
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   CREATE TABLE favorites (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     repo_id BIGINT NOT NULL,
     repo_name VARCHAR(255) NOT NULL,
     repo_url VARCHAR(500) NOT NULL,
     description TEXT,
     language VARCHAR(100),
     stars_count INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(user_id, repo_id)
   );

   CREATE INDEX idx_favorites_user_id ON favorites(user_id);
   ```

5. **Start the backend**
   ```bash
   npm run dev
   ```

6. **Set up the frontend**
   ```bash
   cd ../client
   npm install
   ```

7. **Create client environment file**
   ```bash
   # client/.env
   VITE_API_URL=http://localhost:8000/api
   ```

8. **Start the frontend**
   ```bash
   npm run dev
   ```

9. **Open your browser**
   ```
   http://localhost:5173
   ```

---

## 📡 API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response (201)**
```json
{
  "message": "User registered successfully",
  "user": { "id": "uuid", "email": "user@example.com" },
  "token": "jwt_token"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response (200)**
```json
{
  "message": "Login successful",
  "user": { "id": "uuid", "email": "user@example.com" },
  "token": "jwt_token"
}
```

### Favorites (Protected Routes)

All favorites endpoints require the `Authorization` header:
```http
Authorization: Bearer <jwt_token>
```

#### Get Favorites
```http
GET /api/me/favorites
```

**Response (200)**
```json
{
  "favorites": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "repo_id": 10270250,
      "repo_name": "react",
      "repo_url": "https://github.com/facebook/react",
      "description": "A JavaScript library for building user interfaces",
      "language": "JavaScript",
      "stars_count": 220000,
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Add Favorite
```http
POST /api/me/favorites
Content-Type: application/json

{
  "repo_id": 10270250,
  "repo_name": "react",
  "repo_url": "https://github.com/facebook/react",
  "description": "A JavaScript library for building user interfaces",
  "language": "JavaScript",
  "stars_count": 220000
}
```

**Response (201)**
```json
{
  "favorite": { ... }
}
```

#### Remove Favorite
```http
DELETE /api/me/favorites/:id
```

**Response (200)**
```json
{
  "message": "Favorite removed"
}
```

---

## 🌐 Deployment

The application is deployed on Vercel:

| Service | URL |
|---------|-----|
| Frontend | [github-repo-explorer-beta.vercel.app](https://git-hub-repo-explorer-beta.vercel.app) |
| Backend | [github-repo-explorer-server.vercel.app](https://git-hub-repo-explorer-server.vercel.app) |
| Database | Supabase (PostgreSQL) |

### Environment Variables

#### Backend (Vercel)
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Supabase pooler connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `CLIENT_URL` | Frontend URL for CORS |
| `VERCEL` | Set to "1" for Vercel deployment |

#### Frontend (Vercel)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |

---

## 🔮 Future Improvements

- [ ] Add OAuth login (GitHub, Google)
- [ ] Implement pagination for large result sets
- [ ] Add repository filtering (by language, stars, date)
- [ ] Create shareable favorite lists
- [ ] Add dark mode support
- [ ] Implement rate limiting on backend
- [ ] Add unit and integration tests
- [ ] Set up CI/CD pipeline

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

**Andy Phan**

- GitHub: [@AndyyyPhan](https://github.com/AndyyyPhan)

---

<p align="center">
  Made with ❤️ and TypeScript
</p>
