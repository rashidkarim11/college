import { Link } from "react-router-dom";
import Form from "../components/form";
import "../styles/form.css";
import LoginForm from "../components/loginForm";
import { useNavigate } from 'react-router-dom';

function Login() {
    
    const navigate = useNavigate();

    return (
        <div className="register-container">
            <LoginForm route={"/api/user/login/"} method={"login"} />
            <Link to="/register" className="register-button">
                Register
            </Link>
        </div>
    );
}
export default Login