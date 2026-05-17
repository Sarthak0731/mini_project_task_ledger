const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRouter = require('./routes/auth');
const taskRouter = require('./routes/tasks');
const usersRouter = require('./routes/users');
const User = require('./models/User');
const Task = require('./models/Task');

dotenv.config();

const seedDatabase = async () => {
  try {
    // Check if users already exist
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }

    console.log('Seeding database with test data...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
    });

    // Create employee users
    const emp1Password = await bcrypt.hash('employee123', 10);
    const employee1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: emp1Password,
      role: 'employee',
    });

    const emp2Password = await bcrypt.hash('employee123', 10);
    const employee2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: emp2Password,
      role: 'employee',
    });

    // Create sample tasks
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    await Task.create({
      title: 'Complete Project Report',
      description: 'Finish and submit the quarterly project report',
      deadline: tomorrow,
      status: 'in-progress',
      assignedTo: employee1._id,
      createdBy: admin._id,
    });

    await Task.create({
      title: 'Review Code Changes',
      description: 'Review pull requests from the dev team',
      deadline: nextWeek,
      status: 'pending',
      assignedTo: employee2._id,
      createdBy: admin._id,
    });

    console.log('✅ Database seeded successfully!');
    console.log('Test accounts created:');
    console.log('  Admin:    admin@example.com / admin123');
    console.log('  Employee: john@example.com / employee123');
    console.log('  Employee: jane@example.com / employee123');
  } catch (error) {
    console.error('Seeding error:', error.message);
  }
};

const startServer = async () => {
  await connectDB();
  await seedDatabase();

  const app = express();
  app.use(cors());
  app.use(express.json());

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  app.set('io', io);

  io.on('connection', (socket) => {
    console.log('Client connected to Socket.IO', socket.id);
    socket.on('disconnect', () => {
      console.log('Client disconnected from Socket.IO', socket.id);
    });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/tasks', taskRouter);
  app.use('/api/users', usersRouter);

  app.get('/', (req, res) => {
    res.json({ message: 'TaskLedger API is running.' });
  });

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
