const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const { specialization, location, search, userLat, userLng } = req.query;
    let query = {};

    // Apply filters
    if (specialization && specialization !== 'All Specializations') {
      query.specialization = specialization;
    }
    if (location && location !== 'All Locations') {
      query.location = location;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }

    let doctors = await Doctor.find(query);

    // Calculate distances if user coordinates are provided
    if (userLat && userLng) {
      doctors = doctors.map(doctor => {
        const distance = calculateDistance(
          parseFloat(userLat),
          parseFloat(userLng),
          doctor.coordinates.lat,
          doctor.coordinates.lng
        );
        return {
          ...doctor.toObject(),
          distance
        };
      });

      // Sort by distance
      doctors.sort((a, b) => a.distance - b.distance);
    }

    res.json({
      success: true,
      doctors
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors',
      error: error.message
    });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ id: req.params.id });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    res.json({
      success: true,
      doctor
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor',
      error: error.message
    });
  }
});

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

module.exports = router; 