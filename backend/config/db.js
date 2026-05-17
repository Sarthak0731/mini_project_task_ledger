const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    let uri;
    
    // Use real MongoDB if MONGO_URI is provided, otherwise use in-memory for development
    if (process.env.MONGO_URI) {
      uri = process.env.MONGO_URI;
    } else {
      console.log('Starting in-memory MongoDB for development...');
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
    }
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
