const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  updateAppointmentStatus
} = require('../controllers/appointmentController');

// Create a new appointment
router.post('/', createAppointment);

// Get appointments by doctor ID
router.get('/doctor/:doctorId', getDoctorAppointments);

// Get appointments by patient email
router.get('/patient/:email', getPatientAppointments);

// Update appointment status
router.patch('/:appointmentId/status', updateAppointmentStatus);

module.exports = router; 