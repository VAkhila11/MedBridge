import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DoctorsNearbyPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [location, setLocation] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentForm, setAppointmentForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    reason: ''
  });
  const [formError, setFormError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const specializations = [
    'All Specializations',
    'Dermatologist',
    'Cardiologist',
    'Pediatrician',
    'Gynecologist',
    'Orthopedic Surgeon',
    'Neurologist',
    'Oncologist',
    'Psychiatrist',
    'ENT Specialist',
    'Dentist'
  ];

  const locations = [
    'All Locations',
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Chennai',
    'Hyderabad',
    'Pune',
    'Kolkata',
    'Ahmedabad',
    'Jaipur',
    'Chandigarh'
  ];

  const sortOptions = [
    { value: 'distance', label: 'Distance' },
    { value: 'rating', label: 'Rating' },
    { value: 'experience', label: 'Experience' }
  ];

  // Get user's location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError('');
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Unable to get your location. Showing all doctors.");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser. Showing all doctors.");
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [specialization, location, userLocation, sortBy]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (specialization && specialization !== 'All Specializations') {
        params.append('specialization', specialization);
      }
      if (location && location !== 'All Locations') {
        params.append('location', location);
      }
      if (search) {
        params.append('search', search);
      }
      if (userLocation) {
        params.append('userLat', userLocation.lat);
        params.append('userLng', userLocation.lng);
      }

      const response = await axios.get(`${API_URL}/api/doctors?${params}`);
      let filteredDoctors = response.data.doctors;

      // Sort doctors based on selected criteria
      if (sortBy === 'rating') {
        filteredDoctors.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'experience') {
        filteredDoctors.sort((a, b) => {
          const expA = parseInt(a.experience);
          const expB = parseInt(b.experience);
          return expB - expA;
        });
      } else if (sortBy === 'distance' && userLocation) {
        // Already sorted by distance from backend
      }

      setDoctors(filteredDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Failed to fetch doctors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const formatDistance = (distance) => {
    if (!distance) return 'N/A';
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${Math.round(distance)}km`;
  };

  const getAreaName = (coordinates) => {
    // This is a simplified version - in a real app, you'd use a geocoding service
    const areas = {
      '17.3850,78.4867': 'Central Hyderabad',
      '17.4500,78.3800': 'Banjara Hills',
      '17.3200,78.5500': 'Secunderabad',
      '17.4100,78.4700': 'Jubilee Hills',
      '17.3500,78.5200': 'Begumpet',
      '17.4300,78.4500': 'HITEC City',
      '17.3800,78.5000': 'Ameerpet',
      '17.4200,78.4300': 'Madhapur',
      '17.3600,78.4800': 'Somajiguda',
      '17.4400,78.4600': 'Gachibowli',
      // New areas
      '17.5200,78.5500': 'Narapally',
      '17.5300,78.5600': 'Narapally',
      '17.5400,78.5700': 'Narapally',
      '17.5500,78.5800': 'Narapally',
      '17.5600,78.5900': 'Narapally',
      '17.5700,78.6000': 'Gatkesar',
      '17.5800,78.6100': 'Gatkesar',
      '17.5900,78.6200': 'Gatkesar',
      '17.6000,78.6300': 'Gatkesar',
      '17.6100,78.6400': 'Gatkesar'
    };
    const key = `${coordinates.lat},${coordinates.lng}`;
    return areas[key] || 'Hyderabad';
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowAppointmentForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setAppointmentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Basic validation
    if (!appointmentForm.name || !appointmentForm.email || !appointmentForm.phone || !appointmentForm.date || !appointmentForm.time) {
      setFormError('Please fill in all required fields');
      return;
    }

    try {
      // Log the selected doctor for debugging
      console.log('Selected Doctor:', selectedDoctor);
      
      // Make API call to create appointment
      const appointmentData = {
        name: appointmentForm.name,
        email: appointmentForm.email,
        phone: appointmentForm.phone,
        date: appointmentForm.date,
        time: appointmentForm.time,
        reason: appointmentForm.reason,
        doctorId: selectedDoctor.id // Use the numeric id from the doctor data
      };

      console.log('Sending appointment data:', appointmentData);

      const response = await axios.post(`${API_URL}/api/appointments`, appointmentData);

      if (response.data.success) {
        // Set success message and show success modal
        const greeting = `Thank you ${appointmentForm.name}! Your appointment with Dr. ${selectedDoctor.name} has been booked successfully for ${appointmentForm.date} at ${appointmentForm.time}.`;
        setSuccessMessage(greeting);
        setShowSuccessModal(true);
        
        // Close form and reset
        setShowAppointmentForm(false);
        setAppointmentForm({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          reason: ''
        });
      } else {
        setFormError(response.data.message || 'Failed to book appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      console.error('Error response:', error.response?.data);
      setFormError(error.response?.data?.message || 'Failed to book appointment. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#e6f7ff', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#0056b3', marginBottom: '30px' }}>Find Doctors Near You</h1>
      
      <div style={{ maxWidth: '1200px', margin: 'auto', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        {/* Location Status */}
        {locationError && (
          <div style={{ 
            color: '#856404', 
            backgroundColor: '#fff3cd', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '20px' 
          }}>
            {locationError}
          </div>
        )}

        {/* Search and Filter Section */}
        <div style={{ marginBottom: '30px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#0056b3',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#004494'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#0056b3'}
            >
              Search
            </button>
          </form>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', minWidth: '200px' }}
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', minWidth: '200px' }}
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', minWidth: '200px' }}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>Sort by {option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ color: 'red', padding: '10px', backgroundColor: '#fff3f3', borderRadius: '5px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ 
              display: 'inline-block',
              width: '50px',
              height: '50px',
              border: '5px solid #f3f3f3',
              borderTop: '5px solid #0056b3',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '10px', color: '#666' }}>Loading doctors...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                style={{
                  padding: '20px',
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  backgroundColor: '#f9f9f9',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '15px',
                  gap: '15px'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid #0056b3'
                  }}>
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80?text=DR';
                      }}
                    />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 5px', color: '#0056b3' }}>{doctor.name}</h3>
                    <p style={{ margin: '0', color: '#555', fontWeight: 'bold' }}>
                      {doctor.specialization}
                    </p>
                  </div>
                </div>

                <div style={{ 
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <p style={{ margin: '0', color: '#555' }}>
                    <strong>Experience:</strong> {doctor.experience}
                  </p>
                  <p style={{ margin: '0', color: '#555' }}>
                    <strong>Location:</strong> {doctor.location} - {getAreaName(doctor.coordinates)}
                  </p>
                  {doctor.distance && (
                    <p style={{ margin: '0', color: '#0056b3', fontWeight: 'bold' }}>
                      <strong>Distance:</strong> {formatDistance(doctor.distance)}
                    </p>
                  )}
                  <p style={{ margin: '0', color: '#555' }}>
                    <strong>Rating:</strong> {doctor.rating} ⭐
                  </p>
                  <p style={{ margin: '0', color: '#555' }}>
                    <strong>Availability:</strong> {doctor.availability}
                  </p>
                  <p style={{ margin: '0', color: '#555' }}>
                    <strong>Contact:</strong> {doctor.contact}
                  </p>
                </div>

                <button
                  onClick={() => handleBookAppointment(doctor)}
                  style={{
                    marginTop: '15px',
                    padding: '10px',
                    backgroundColor: '#0056b3',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#004494'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#0056b3'}
                >
                  Book Appointment
                </button>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Appointment Form Modal */}
      {showAppointmentForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ color: '#0056b3', margin: 0 }}>Book Appointment</h2>
              <button
                onClick={() => setShowAppointmentForm(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            {selectedDoctor && (
              <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                <h3 style={{ margin: '0 0 5px 0', color: '#0056b3' }}>{selectedDoctor.name}</h3>
                <p style={{ margin: '0', color: '#666' }}>{selectedDoctor.specialization}</p>
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={appointmentForm.name}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #ddd'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={appointmentForm.email}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #ddd'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={appointmentForm.phone}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #ddd'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
                  Preferred Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={appointmentForm.date}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #ddd'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
                  Preferred Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={appointmentForm.time}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #ddd'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
                  Reason for Visit
                </label>
                <textarea
                  name="reason"
                  value={appointmentForm.reason}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    minHeight: '100px'
                  }}
                />
              </div>

              {formError && (
                <div style={{ color: 'red', marginBottom: '15px' }}>
                  {formError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#0056b3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Book Now
                  {loading && <span>Loading...</span>}
                  
                </button>
                <button
                  type="button"
                  onClick={() => setShowAppointmentForm(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                  {loading && <span>Loading...</span>}
                 
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1001
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            width: '90%',
            maxWidth: '500px',
            textAlign: 'center'
          }}>
            <div style={{
              marginBottom: '20px',
              color: '#28a745',
              fontSize: '48px'
            }}>
              ✓
            </div>
            <h2 style={{ color: '#28a745', marginBottom: '15px' }}>Success!</h2>
            <p style={{ 
              color: '#555',
              marginBottom: '25px',
              lineHeight: '1.5'
            }}>
              {successMessage}
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default DoctorsNearbyPage;