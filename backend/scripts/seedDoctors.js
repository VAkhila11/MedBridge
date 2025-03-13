const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Doctor = require('../models/Doctor');
const connectDB = require('../config/db');

// Read doctors data from JSON file
const doctorsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/doctors.json'), 'utf8')
);

const seedDoctors = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing doctors
    await Doctor.deleteMany({});
    console.log('Cleared existing doctors data');

    // Insert new doctors
    const doctors = await Doctor.insertMany(doctorsData.doctors);
    console.log(`Successfully inserted ${doctors.length} doctors`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding doctors:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDoctors(); 