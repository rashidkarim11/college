import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useState } from "react";
import Form from "../components/form";
import "../styles/form.css";
import LoadingIndicator from "./LoadingIndicator";  // Ensure this is imported correctly

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const res = await axios.post("http://localhost:8000/api/user/login/", { email, password });
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            navigate("/home");
        } catch (error) {
            console.error("Error Response:", error.response);  // Log error response
            setErrorMessage("Invalid username or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Form 
                route={"/api/user/login/"} 
                method={"login"} 
                onSubmit={handleSubmit}  // Pass the handleSubmit function as a prop
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
            />
            {errorMessage && <small className="error-message">{errorMessage}</small>}
            {loading && <LoadingIndicator />}
        </div>
    );
}

export default LoginForm;
