import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ConfirmEmail() {
    const { token } = useParams();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const response = await axios.get(`/api/confirm_email/${token}`);
                setMessage(response.data);
            } catch (error) {
                setMessage('Email confirmation failed. Please try again.');
            }
        };

        confirmEmail();
    }, [token]);

    return (
        <div>
            <h1>{message}</h1>
        </div>
    );
}

export default ConfirmEmail;
