import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/form.css";
import LoadingIndicator from "./LoadingIndicator";  // Ensure this is imported correctly

function Form({ route, method, onSubmit, email, setEmail, password, setPassword }) {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassGuidelines, setShowPassGuidelines] = useState(false);
    const [showEmailGuidelines, setShowEmailGuidelines] = useState(false);

    const name = method === "login" ? "Login" : "Register";

    const validateInputs = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailValid = emailRegex.test(email);
        const passwordValid = /^(?=.*[A-Z])(?=.*[!@#$&*]).{6,}$/.test(password);

        if (!emailValid && email !== "") {
            setErrorMessage("Username must be an email adress");
            return false;
        }

        if (!passwordValid && password !== "") {
            setErrorMessage("Password must be at least 6 characters long, with at least 1 uppercase letter and 1 special character.");
            return false;
        }

        setErrorMessage(""); // Clear any previous error messages
        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "email") {
            setEmail(value);
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const emailValid = emailRegex.test(email);
            setShowEmailGuidelines(!emailValid);
        } else if (name === "password") {
            setPassword(value);
            const passwordValid = /^(?=.*[A-Z])(?=.*[!@#$&*]).{6,}$/.test(value);
            setShowPassGuidelines(!passwordValid);
        }

        validateInputs(); // Validate on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!validateInputs()) {
            setLoading(false);
            return; // Prevent form submission if validation fails
        }

        try {
            await onSubmit(e); // Use the onSubmit function passed as a prop
        } catch (error) {
            setErrorMessage("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1 className="heading">{name}</h1>
            <input
                className="form-input"
                type="text"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Example@gmail.com"
            />
            {showEmailGuidelines && (
                <small className="user-guidelines">
                    Username must be an email adress.
                </small>
            )}
            <input
                className="form-input"
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Password"
            />
            {errorMessage && <small className="error-message">{errorMessage}</small>}
            {showPassGuidelines && (
                <small className="password-guidelines">
                    Password must be at least 6 characters long, with at least 1 uppercase letter and 1 special character.
                </small>
            )}
            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">
                {name}
            </button>
        </form>
    );
}

export default Form;
