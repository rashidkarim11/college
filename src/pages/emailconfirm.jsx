import React, { useEffect } from 'react';

function ConfirmEmailNotice() {
    // useEffect hook to close the window after 7 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            window.close();  // Close the current tab or window
        }, 7000);

        // Cleanup the timer to avoid memory leaks
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="confirmation-notice">
            <h1>Registration Successful!</h1>
            <p>Please check your email to confirm your account before logging in.</p>
        </div>
    );
}

export default ConfirmEmailNotice;

