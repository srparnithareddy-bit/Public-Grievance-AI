/**
 * Database Configuration & Connection Manager
 * 
 * Attempts to connect to MongoDB using Mongoose.
 * If MongoDB is not reachable (e.g. running locally without a daemon),
 * it gracefully switches to an in-memory repository with pre-seeded demo data
 * so hackathon evaluators can immediately run and test the app without DB setup friction.
 */

const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/public_grievance_db';

  try {
    console.log(`Connecting to MongoDB at: ${mongoURI.replace(/:([^:@]{4})[^:@]*@/, ':****@')}...`);
    
    // Set a 3.5 second timeout so the application starts instantly even if local MongoDB isn't running
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3500,
      connectTimeoutMS: 3500,
    });

    isMongoConnected = true;
    console.log('✅ [Database] Connected successfully to MongoDB via Mongoose');
  } catch (err) {
    isMongoConnected = false;
    console.warn('⚠️  [Database] MongoDB connection failed or not detected.');
    console.warn(`    Reason: ${err.message}`);
    console.log('💡  [Database] Running in Fallback In-Memory Mode with pre-seeded demo data.');
    console.log('    To use full MongoDB, ensure mongod is running or set MONGO_URI in .env');
  }
};

const getDBStatus = () => ({
  connected: isMongoConnected,
  mode: isMongoConnected ? 'MongoDB (Mongoose)' : 'Fallback In-Memory Store',
});

module.exports = {
  connectDB,
  getDBStatus,
  get isMongoConnected() {
    return isMongoConnected;
  }
};
