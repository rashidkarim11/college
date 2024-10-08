import React, { useState } from 'react';
import RegisterModal from '../components/RegisterModal'; // Ensure the path is correct
import RegistrationPage from '../components/appInfo';
import LoginModal from '../components/LoginModal'; // Import the login modal
import "../styles/registration.css"; // Assuming this contains the main styles for your page

function HomePage() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);  // Control login modal visibility

    const openLoginModal = () => {
        setIsLoginOpen(true);
    };

    const closeLoginModal = () => {
        setIsLoginOpen(false);
    };

    return (
        <div className="homepage-container">
            <h1 className='welcome'>Welcome to CollegeAid</h1>
            
            <div className="login-button-container">
                <button onClick={openLoginModal} className="login-button">
                    Login
                </button>
            </div>

            <RegistrationPage />

            {/* Register Modal */}
            

            {/* Login Modal */}
            {isLoginOpen && (
                <LoginModal closeLoginModal={closeLoginModal} />
            )}
        </div>
    );
}

export default HomePage;


