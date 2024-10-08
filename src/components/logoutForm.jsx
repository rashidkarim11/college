import { useNavigate } from "react-router-dom";

const handleLogout = () => {
    localStorage.clear()
    // Optionally redirect the user to the login page
  };

export default handleLogout
