const emailjs = require('@emailjs/nodejs');

// Debug log to check environment variables
console.log('EmailJS Public Key:', process.env.EMAILJS_PUBLIC_KEY);
console.log('EmailJS Service ID:', process.env.EMAILJS_SERVICE_ID);
console.log('EmailJS Template ID:', process.env.EMAILJS_TEMPLATE_ID);

// Function to send appointment confirmation email
const sendAppointmentConfirmation = async (appointment, doctor) => {
  try {
    const templateParams = {
      to_name: appointment.patientName,
      doctor_name: doctor.name,
      specialization: doctor.specialization,
      appointment_date: new Date(appointment.appointmentDate).toLocaleDateString(),
      appointment_time: appointment.appointmentTime,
      location: doctor.location,
      to_email: appointment.email
    };

    console.log('Sending email with params:', {
      serviceId: process.env.EMAILJS_SERVICE_ID,
      templateId: process.env.EMAILJS_TEMPLATE_ID,
      templateParams
    });

    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY
      }
    );

    if (response.status === 200) {
      console.log('Appointment confirmation email sent successfully');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error sending appointment confirmation email:', error);
    return false;
  }
};

// Function to send appointment reminder email
const sendAppointmentReminder = async (appointment, doctor) => {
  try {
    const templateParams = {
      to_name: appointment.patientName,
      doctor_name: doctor.name,
      specialization: doctor.specialization,
      appointment_date: new Date(appointment.appointmentDate).toLocaleDateString(),
      appointment_time: appointment.appointmentTime,
      location: doctor.location,
      to_email: appointment.email
    };

    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_REMINDER_TEMPLATE_ID,
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY
      }
    );

    if (response.status === 200) {
      console.log('Appointment reminder email sent successfully');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error sending appointment reminder email:', error);
    return false;
  }
};

module.exports = {
  sendAppointmentConfirmation,
  sendAppointmentReminder
}; 