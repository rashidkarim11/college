import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/form.css";
import "../styles/modal.css";  // Import modal styles
import LoadingIndicator from "./LoadingIndicator";  // Ensure this is imported correctly
import Form from "../components/form";

function LoginModal({ closeLoginModal }) {
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
            closeLoginModal();  // Close modal on successful login
            navigate("/home");  // Navigate to home
        } catch (error) {
            console.error("Error Response:", error.response);
            setErrorMessage("Invalid username or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={closeLoginModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close" onClick={closeLoginModal}>&times;</span>
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
        </div>
    );
}

export default LoginModal;

