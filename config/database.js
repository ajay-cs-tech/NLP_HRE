// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      socketTimeoutMS: 30000 
    });
    console.log('Connected to MongoDB successfully!');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit process with failure
  }
}

module.exports = connectToMongoDB;
