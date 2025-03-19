const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { sendAppointmentConfirmation } = require('../utils/emailService');

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { name, email, phone, date, time, reason, doctorId } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !date || !time || !reason || !doctorId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Find doctor by numeric ID
    const doctor = await Doctor.findOne({ id: doctorId });

    if (!doctor) {
      console.error('Doctor not found for ID:', doctorId);
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check if the time slot is available
    const existingAppointment = await Appointment.findOne({
      doctorId: doctor._id,
      appointmentDate: date,
      appointmentTime: time,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    // Create new appointment
    const appointment = await Appointment.create({
      patientName: name,
      email,
      phone,
      appointmentDate: date,
      appointmentTime: time,
      reason,
      doctorId: doctor._id,
      status: 'confirmed'
    });

    // Send confirmation email
    try {
      await sendAppointmentConfirmation(appointment, doctor);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the appointment creation if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating appointment',
      error: error.message
    });
  }
};

// Get appointments by doctor ID
exports.getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findOne({ id: doctorId });
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const appointments = await Appointment.find({ doctorId: doctor._id })
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
};

// Get appointments by patient email
exports.getPatientAppointments = async (req, res) => {
  try {
    const { email } = req.params;
    const appointments = await Appointment.find({ email })
      .populate('doctorId', 'name specialization')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment status updated successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating appointment status',
      error: error.message
    });
  }
}; 