import React from 'react';
import CollegeList from '../components/CollegeList';  // Adjust the path based on your folder structure
import "../styles/collegelistpage.css";

const CollegeListPage = () => {
    return (
        <div className="college-list-page">
            {/* Navigation Toolbar */}
            <nav className="navbar">
                <ul className="nav-links">
                    <li><a href="http://localhost:5173/home">Home</a></li>
                    <li><a href="http://localhost:5173/collegelist">Colleges</a></li>
                    <li><a href="http://localhost:5173/cal">Calendar</a></li>
                    <li><a href="#">Help</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </nav>

            {/* Main content */}
            <h1 id='header'>Browse Colleges</h1>
            <h4>Click on the cards to learn more</h4>
            <CollegeList />
        </div>
    );
};


export default CollegeListPage;
