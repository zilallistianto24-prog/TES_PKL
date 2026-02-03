# 🚀 Task Management Application - Complete Setup Guide

## Prerequisites

Before you begin, make sure you have installed:

- **Node.js** v14 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** v12 or higher ([Download](https://www.postgresql.org/))
- **Git** ([Download](https://git-scm.com/))

Verify installations:
```bash
node --version
npm --version
postgres --version
git --version
```

---

## 📦 Step-by-Step Setup

### Step 1: Clone or Download the Repository

```bash
# If cloning from GitHub:
git clone https://github.com/yourusername/task-management-bff.git
cd task-management-bff
```

### Step 2: Database Setup

#### Create PostgreSQL Database

1. Open PostgreSQL command line (psql) or pgAdmin
2. Create the database:

```sql
CREATE DATABASE task_management;
```

3. Connect to the database:
```sql
\c task_management
```

### Step 3: Backend Setup

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

4. **Configure `.env` with your database credentials:**
   ```env
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=task_management
   DB_PASSWORD=your_postgres_password
   DB_PORT=5432
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your-secret-key-change-in-production
   CORS_ORIGIN=http://localhost:5173
   ```

5. **Initialize the database (creates tables and seeds demo data):**
   ```bash
   npm run init
   ```

   **Expected output:**
   ```
   ✅ Admin user created: admin@example.com / admin123
   ✅ Sample users created
   ✅ Database initialized successfully
   ```

6. **Start the backend server:**
   ```bash
   npm start
   ```

   **Expected output:**
   ```
   Server running on http://localhost:5000
   ```

### Step 4: Frontend Setup

1. **In a new terminal, navigate to frontend directory:**
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

4. **Verify `.env` configuration:**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

   **Expected output:**
   ```
   ✔ ready in 500ms
   
   ➜  Local:   http://localhost:5173/
   ➜  press h to show help
   ```

---

## ✅ Verification & Testing

### 1. Access Frontend

Open browser and navigate to:
```
http://localhost:5173/
```

### 3. Login with Demo Credentials

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**Regular User:**
- Email: `john@example.com`
- Password: `password123`

### 4. Test Features

After login, you can:
- ✅ View all tasks in Tasks tab
- ✅ Create a new task
- ✅ Update task status
- ✅ Edit/Delete tasks
- ✅ Manage users in Users tab
- ✅ Create/Edit/Delete users

---

## 📁 Project Structure

```
task-management-bff/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Auth middleware
│   │   ├── services/         # Business logic (BFF)
│   │   └── config/           # Database config
│   ├── init-db.js           # Database initialization
│   ├── server.js            # Server entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/             # API client
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Global state
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
│
├── README.md
└── .gitignore
```

---

## 🔧 Available Commands

### Backend Commands

```bash
# Start server
npm start

# Initialize database
npm run init

# Watch mode (if configured)
npm run dev
```

### Frontend Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - List all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Tasks
- `GET /api/tasks` - List all tasks
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `PATCH /api/tasks/{id}/status` - Update task status
- `DELETE /api/tasks/{id}` - Delete task

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**
- Verify PostgreSQL is running
- Check database credentials in backend `.env`
- Ensure database `task_management` exists
- Try running `npm run init` again

### Issue: "CORS error" or "Network error"

**Solution:**
- Verify backend is running on port 5000
- Check frontend `.env` has correct API URL
- Ensure `CORS_ORIGIN` in backend `.env` matches frontend URL

### Issue: "Cannot find module"

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Kill process on port 5000 or change PORT in backend .env
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti :5000 | xargs kill -9
```

### Issue: "JWT token expired"

**Solution:**
- Refresh the page or logout and login again
- Check JWT_EXPIRY in backend `.env`

---

## 📝 Environment Variables Reference

### Backend (.env)

| Variable | Default | Description |
|----------|---------|-------------|
| DB_USER | postgres | PostgreSQL user |
| DB_HOST | localhost | PostgreSQL host |
| DB_NAME | task_management | Database name |
| DB_PASSWORD | postgres | PostgreSQL password |
| DB_PORT | 5432 | PostgreSQL port |
| PORT | 5000 | Backend server port |
| NODE_ENV | development | Environment |
| JWT_SECRET | your-secret-key | Secret key for JWT |
| JWT_EXPIRY | 7d | Token expiration |
| CORS_ORIGIN | http://localhost:5173 | Frontend URL |

### Frontend (.env)

| Variable | Default | Description |
|----------|---------|-------------|
| VITE_API_URL | http://localhost:5000/api | Backend API URL |

---

## 🎨 UI Features

- ✨ Modern gradient design with purple theme
- 📱 Fully responsive for mobile and desktop
- ⚡ Smooth animations and transitions
- 🎯 Intuitive navigation with emojis
- 🔄 Real-time updates
- ✔️ Form validation and error handling
- 📊 Clean dashboard layout

---

## 🏗 Architecture Highlights

### BFF Pattern Implementation
- **Single API Gateway**: One backend serves the frontend
- **Service Layer**: Centralized business logic
- **Response Contracts**: Consistent JSON format
- **Error Handling**: Unified error responses
- **State Aggregation**: Backend aggregates data

### Security Features
- JWT-based authentication
- Protected API routes with middleware
- Password stored (plaintext in demo - use bcrypt in production)
- CORS enabled for frontend origin only

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Information](https://jwt.io/)

---

## 🤝 Contributing

Feel free to fork, modify, and improve this project!

---

## 📄 License

ISC License - Feel free to use for learning and projects.

---

**Need Help?**
- Check the troubleshooting section
- Review API documentation at `/api-docs`
- Check browser console for errors
- Review backend logs in terminal

**Happy Coding! 🎉**
