import React, { useState } from 'react';
import axios from 'axios';
import Form from "../components/form";
import "../styles/form.css";

function RegisterModal() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [isOpen, setIsOpen] = useState(false);  // Control modal visibility
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8000/api/user/register/", { email, password });
            console.log('Registration successful');
            setRegistrationSuccess(true);  // Indicate success
            setTimeout(() => {
                closeModal();  // Close the modal after successful registration
            }, 3500);  // You can adjust the delay if needed
        } catch (error) {
            console.error("An error occurred during registration:", error);
        }
    };

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setRegistrationSuccess(false);  // Reset success state when closing
    };

    return (
        <div>
            {/* Button to trigger the modal */}
            <button className="register-btn" onClick={openModal}>
                Register
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>&times;</span>

                        {!registrationSuccess ? (
                            <Form
                                route={"/api/user/register/"}
                                method={"register"}
                                onSubmit={handleRegister}
                                email={email}
                                setEmail={setEmail}
                                password={password}
                                setPassword={setPassword}
                            />
                        ) : (
                            <div className="success-message">
                                <h1>Registration Successful!</h1>
                                <p>Please check your email to confirm your account before logging in.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}


export default RegisterModal;
