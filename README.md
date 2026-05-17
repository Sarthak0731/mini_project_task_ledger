# TaskLedger

A full-stack office task and accountability system built with React, Node.js, Express, and MongoDB.

## Features

- Admin and employee roles
- User authentication with JWT
- Task creation, assignment, and status updates
- Dashboard analytics for completed, pending, and overdue tasks
- Responsive React frontend with Bootstrap styling

## Setup

1. Ensure MongoDB is running locally:
   ```bash
   mongod
   ```

2. Install dependencies:

```bash
cd /home/sarthak_unix7/mini_project
npm run install-all
```

3. Create a backend environment file at `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskledger
JWT_SECRET=your_jwt_secret
```

4. Seed the database with test users and sample tasks:

```bash
cd backend
npm run seed
```

5. Start both backend and frontend:

```bash
npm run dev
```

6. Open the frontend at `http://localhost:3000` and login with:

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**Employee Accounts:**
- Email: `john@example.com` | Password: `employee123`
- Email: `jane@example.com` | Password: `employee123`

## Backend

- `backend/server.js`
- `backend/routes/auth.js`
- `backend/routes/tasks.js`
- `backend/models/User.js`
- `backend/models/Task.js`

## Frontend

- `frontend/src/App.js`
- `frontend/src/components/Login.js`
- `frontend/src/components/Dashboard.js`
- `frontend/src/components/CreateTask.js`
- `frontend/src/components/TaskList.js`
- `frontend/src/api.js`
