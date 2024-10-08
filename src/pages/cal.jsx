import UserCalendar from '../components/calendar';
//import '../styles/calendar.css';

const Cal = () => {
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
            <UserCalendar />
        </div>
    );
}

export default Cal;
