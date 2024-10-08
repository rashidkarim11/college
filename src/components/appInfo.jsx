import React from 'react';
import '../styles/registration.css';  // Make sure to link to the correct CSS file
import { FaCalculator, FaBookOpen, FaSearch, FaUserGraduate, FaPencilAlt, FaFileAlt } from 'react-icons/fa';
import RegisterModal from '../components/RegisterModal';

function RegistrationPage() {
    return (
        <div className="registration-page">
            <div className="title-section">
                <h1 className="main-title">CollegeAid</h1>
                <p className="subtitle">Your Personalized College Admissions Tool</p>
                <div className="register-section">
                    <h2>Register Now</h2>
                    <RegisterModal />
                </div>
            </div>

            <div className="cta-banner">
                <p>Get Started on Your Journey to College!</p>
            </div>

            <div className="buzzwords-section">
                {/* Group 1 of buzzwords */}
                <div className="buzzword-group">
                    <div className="buzzword-container">
                        <FaPencilAlt size={40} color="#3498db" />
                        <div className="buzzword-shape">Essay Tips & Tools</div>
                        <p className="buzzword-description">
                            Get personalized tips and resources to help you craft a compelling college essay.
                        </p>
                    </div>

                    <div className="buzzword-container">
                        <FaFileAlt size={40} color="#3498db" />
                        <div className="buzzword-shape">Test Prep Resources</div>
                        <p className="buzzword-description">
                            Access resources to help you prepare for standardized tests like the SAT and ACT.
                        </p>
                    </div>
                </div>

                {/* Centered image */}
                <div className="buzzword-image-container">
                    <img 
                        src="/images/CollegeAid.jpg" 
                        alt="CollegeAid" 
                        className="buzzword-image" 
                    />
                </div>

                {/* Group 2 of buzzwords */}
                <div className="buzzword-group">
                    <div className="buzzword-container">
                        <FaCalculator size={40} color="#3498db" />
                        <div className="buzzword-shape">Admissions Calculator</div>
                        <p className="buzzword-description">
                            Use our powerful calculator to estimate your chances of getting into top colleges.
                        </p>
                    </div>
                    
                    <div className="buzzword-container">
                        <FaBookOpen size={40} color="#3498db" />
                        <div className="buzzword-shape">Step by Step Guide</div>
                        <p className="buzzword-description">
                            Follow our comprehensive guide to navigate the entire college admissions process.
                        </p>
                    </div>

                    <div className="buzzword-container">
                        <FaSearch size={40} color="#3498db" />
                        <div className="buzzword-shape">Make the Search Easier</div>
                        <p className="buzzword-description">
                            Simplify your college search with personalized recommendations and filters.
                        </p>
                    </div>

                    <div className="buzzword-container">
                        <FaUserGraduate size={40} color="#3498db" />
                        <div className="buzzword-shape">Personalized Guidance</div>
                        <p className="buzzword-description">
                            Receive advice and guidance tailored to your academic goals and profile.
                        </p>
                    </div>
                </div>
                <div className="faq-section">
    <h2>Frequently Asked Questions</h2>
    <div className="faq-item">
        <h3>What is CollegeAid?</h3>
        <p>CollegeAid is your personalized college admissions tool designed to guide you through the entire process.</p>
    </div>
    <div className="faq-item">
        <h3>How do I register?</h3>
        <p>Click the "Register Now" button above to start the simple registration process.</p>
    </div>
    <div className="faq-item">
        <h3>Why Did We Create CollegeAid?</h3>
        <p>We Created CollegeAid because of blah blah blah</p>
    </div>
</div>

            </div>
        </div>
    );
}

export default RegistrationPage;
