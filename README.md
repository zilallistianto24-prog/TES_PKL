# Task Management Application - BFF Pattern

A full-stack Task Management application built with **Express.js (Backend)**, **React.js (Frontend)**, and **PostgreSQL** database, implementing the Backend for Frontend (BFF) pattern.

## 🎯 Features

### Authentication & Authorization
- User login with JWT authentication
- Secure token-based API access
- Role-based access control (Admin/User)

### User Management
- List all users
- Create new users
- Update user information
- Delete users
- User role management

### Task Management
- Create tasks with user assignment
- List all tasks with detailed information
- Update task details (title, description, assigned user)
- Update task status (pending, in_progress, completed, cancelled)
- Delete tasks
- Date tracking (created_at, updated_at)

### Additional Features
- Beautiful, responsive UI with gradient design
- Real-time status updates
- Error handling and validation
- BFF service layer for business logic aggregation

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **JWT** for authentication
- **Bcryptjs** for password hashing

### Frontend
- **React 19** with Vite
- **React Router** for navigation
- **Axios** for HTTP requests
- **Context API** for state management
- **CSS3** with modern styling

## 📋 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app setup
│   │   ├── config/
│   │   │   └── db.js             # Database configuration
│   │   ├── controllers/           # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   └── task.controller.js
│   │   ├── middleware/            # Custom middleware
│   │   │   └── authMiddleware.js
│   │   ├── routes/                # API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   └── task.routes.js
│   │   └── services/              # BFF service layer
│   │       └── bff.service.js
│   ├── server.js                  # Server entry point
│   ├── init-db.js                 # Database initialization
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js             # API client
│   │   ├── context/
│   │   │   └── AppContext.jsx     # Global state management
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Login page
│   │   │   ├── Login.css
│   │   │   ├── Dashboard.jsx      # Main dashboard
│   │   │   └── Dashboard.css
│   │   ├── components/
│   │   │   ├── TaskForm.jsx       # Task form component
│   │   │   ├── TaskList.jsx       # Task list component
│   │   │   ├── UserManagement.jsx # User management component
│   │   │   └── CSS files...
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── index.html
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Update database configuration in `.env`:**
   ```env
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=task_management
   DB_PASSWORD=postgres
   DB_PORT=5432
   JWT_SECRET=your-secret-key-change-in-production
   ```

5. **Initialize the database:**
   ```bash
   npm run init
   ```

6. **Start the backend server:**
   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 📚 API Documentation

### Authentication
- **POST** `/api/auth/login` - Login user
- **POST** `/api/auth/logout` - Logout user

### Users
- **GET** `/api/users` - List all users
- **GET** `/api/users/{id}` - Get user by ID
- **POST** `/api/users` - Create new user
- **PUT** `/api/users/{id}` - Update user
- **DELETE** `/api/users/{id}` - Delete user

### Tasks
- **GET** `/api/tasks` - List all tasks
- **GET** `/api/tasks/{id}` - Get task by ID
- **POST** `/api/tasks` - Create new task
- **PUT** `/api/tasks/{id}` - Update task details
- **PATCH** `/api/tasks/{id}/status` - Update task status
- **DELETE** `/api/tasks/{id}` - Delete task

## 🔐 Demo Credentials

Use these credentials to test the application:

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

**Regular User:**
- Email: `john@example.com`
- Password: `password123`

## 🏗 BFF Pattern Implementation

This application implements the Backend for Frontend (BFF) pattern:

1. **Unified API Gateway**: Single backend serves the frontend with tailored endpoints
2. **Service Layer**: Business logic separated in `bff.service.js`
3. **Response Contracts**: Consistent JSON response format with `success` flag
4. **Error Handling**: Centralized error handling and validation
5. **State Aggregation**: Backend aggregates data from multiple sources

## 🎨 UI/UX Features

- Modern gradient design with purple theme
- Responsive layout for mobile and desktop
- Smooth animations and transitions
- Intuitive navigation with emoji icons
- Real-time status updates
- Form validation
- User-friendly error messages
- Loading states

## 📝 Request/Response Examples

### Login Request
```json
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "admin123"
}

Response:
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Admin",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

### Create Task Request
```json
POST /api/tasks
Authorization: Bearer {token}
{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "user_id": 1
}

Response:
{
  "success": true,
  "data": {
    "id": 5,
    "title": "Complete project documentation",
    "description": "Write comprehensive README and API docs",
    "status": "pending",
    "user_id": 1
  },
  "message": "Task berhasil dibuat"
}
```

## 🔧 Environment Variables

### Backend (.env)
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=task_management
DB_PASSWORD=postgres
DB_PORT=5432
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🐛 Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database `task_management` exists or run `npm run init`

### CORS Error
- Ensure backend is running on port 5000
- Check `CORS_ORIGIN` in backend `.env`

### Token Expired
- Clear browser localStorage
- Login again to get a new token

## 📄 License

This project is open-source and available under the ISC License.

## 👨‍💻 Author

Created as a mini project for demonstrating BFF architecture pattern with Express.js and React.js.

---

**Last Updated:** January 2026
