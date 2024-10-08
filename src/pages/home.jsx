import React from 'react';
import UserForm from '../components/userDataForm';
import GptPromptForm from '../components/gptPrompt';
import { useNavigate } from "react-router-dom";
import handleLogout from '../components/logoutForm';  // Import the existing handleLogout function
import "../styles/HomePage.css";  // Ensure you're importing your CSS file

const HomePage = () => {
  const navigate = useNavigate();  // Hook to handle redirection

  const handleLogoutAndRedirect = () => {
    handleLogout();
    navigate('/register');  // Redirect to the login/register page after logout
  };

  return (
    <div className="container">
      {/* Navigation Toolbar */}
      <nav className="navbar">
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="http://localhost:5173/collegelist">Colleges</a></li>
          <li><a href="http://localhost:5173/cal">Calendar</a></li>
          <li><a href="#">Help</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>

      {/* Main content */}
      <h1>Welcome to the College App</h1>
      <UserForm />
      <GptPromptForm />
      
      <button className="logout-button" onClick={handleLogoutAndRedirect}>
        Logout
      </button>
    </div>
  );
};

export default HomePage;

