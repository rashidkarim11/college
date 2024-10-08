import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Import Axios to use the interceptor
import "../styles/form.css";  // Import styles for modal

const UserForm = () => {
  const [formData, setFormData] = useState({
    gpa: '',
    sat: '',
    grade: '',
  });
  const [isModalVisible, setModalVisible] = useState(false);  // Control the visibility of the modal
  const [isSubmitted, setIsSubmitted] = useState(false);  // Control if the form was submitted
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);  // Track success message visibility

  useEffect(() => {
    // Check localStorage to see if the user has already submitted the form
    const hasSubmittedForm = localStorage.getItem('hasSubmittedForm');
    if (!hasSubmittedForm) {
      setModalVisible(true);  // Show the modal only if they haven't submitted the form yet
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make POST request using Axios, interceptor will attach the token
      const response = await axios.post('http://localhost:8000/api/save-user-data/', formData);
      
      // Log the response (assuming response.data contains the message)
      console.log(response.data.message);

      // After successful form submission, hide the modal and show the success message
      setIsSubmitted(true);
      setModalVisible(false);  // Hide the modal after submit
      setShowSuccessMessage(true);  // Show success message

      // Save to localStorage to indicate that the form has been submitted
      localStorage.setItem('hasSubmittedForm', 'true');

    } catch (error) {
      console.error('Error:', error);
    }
  };

  // useEffect hook to handle the auto-disappearance and fade-out of the success message
  useEffect(() => {
    if (showSuccessMessage) {
      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);  // Hide the success message
      }, 5000);

      // Apply fade-out effect 1 second before it disappears
      const fadeOutTimer = setTimeout(() => {
        const successMessageElement = document.querySelector('.success-message');
        if (successMessageElement) {
          successMessageElement.classList.add('fade-out');
        }
      }, 4000);

      // Clean up the timers when the component unmounts or state changes
      return () => {
        clearTimeout(timer);
        clearTimeout(fadeOutTimer);
      };
    }
  }, [showSuccessMessage]);

  return (
    <div>
      {/* Modal (Form) */}
      {isModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h2>Provide Your Information</h2>
            <p>Your information will help the app provide better predictions tailored to your profile.</p>

            <form onSubmit={handleSubmit}>
              <label>
                GPA:
                <input
                  type="text"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                SAT:
                <input
                  type="text"
                  name="sat"
                  value={formData.sat}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Grade:
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                />
              </label>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

      {/* Show a success message after submission, which disappears after 5 seconds */}
      {showSuccessMessage && (
        <div className="success-message">
          <h3>Thank you!</h3>
          <p>Your information has been submitted successfully.</p>
        </div>
      )}
    </div>
  );
};

export default UserForm;

