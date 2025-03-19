const mongoose = require('mongoose');
const { sendAppointmentReminder } = require('../utils/emailService');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const connectDB = require('../config/db');

const sendReminders = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    // Find appointments for tomorrow
    const appointments = await Appointment.find({
      appointmentDate: {
        $gte: tomorrow,
        $lt: dayAfterTomorrow
      },
      status: 'confirmed'
    }).populate('doctor');

    console.log(`Found ${appointments.length} appointments for tomorrow`);

    // Send reminders
    for (const appointment of appointments) {
      const emailSent = await sendAppointmentReminder(appointment, appointment.doctor);
      if (emailSent) {
        console.log(`Reminder sent for appointment with Dr. ${appointment.doctor.name}`);
      } else {
        console.log(`Failed to send reminder for appointment with Dr. ${appointment.doctor.name}`);
      }
    }

    console.log('Finished sending appointment reminders');
    process.exit(0);
  } catch (error) {
    console.error('Error sending appointment reminders:', error);
    process.exit(1);
  }
};

sendReminders(); 