const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./models/User');
const Task = require('./models/Task');
require('dotenv').config();

let mongoServer;

const seedDatabase = async () => {
  try {
    // Start in-memory MongoDB for development
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to in-memory MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
    });
    console.log('Admin user created:', admin.email);

    // Create employee users
    const emp1Password = await bcrypt.hash('employee123', 10);
    const employee1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: emp1Password,
      role: 'employee',
    });
    console.log('Employee 1 created:', employee1.email);

    const emp2Password = await bcrypt.hash('employee123', 10);
    const employee2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: emp2Password,
      role: 'employee',
    });
    console.log('Employee 2 created:', employee2.email);

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

    console.log('Sample tasks created');
    console.log('\n✅ Database seeded successfully!\n');
    console.log('Login credentials:');
    console.log('  Admin:    admin@example.com / admin123');
    console.log('  Employee: john@example.com / employee123');
    console.log('  Employee: jane@example.com / employee123\n');

    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  } catch (error) {
    console.error('Seed error:', error.message);
    if (mongoServer) await mongoServer.stop();
    process.exit(1);
  }
};

seedDatabase();
