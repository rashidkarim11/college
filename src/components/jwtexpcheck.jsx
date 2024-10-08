import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useAxiosInterceptors = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const decodeJWT = (token) => {
      try {
        // Split the JWT into three parts
        const base64Url = token.split('.')[1]; // The payload is the second part
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace special characters
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
      }
    };

    const checkTokenExpiration = (token) => {
      try {
        const decodedToken = decodeJWT(token);  // Decode the JWT token
        if (!decodedToken) return false;        // Return false if decoding failed

        const currentTime = Date.now() / 1000;  // Current time in seconds
        return decodedToken.exp < currentTime;  // Token is expired if true
      } catch (error) {
        console.error('Error checking token expiration:', error);
        return false;
      }
    };

    // Add Axios interceptor for all outgoing requests
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access');

        if (config.url.includes('/register') || config.url.includes('/login')) {
          return config;  // Skip token checks for register and login routes
        }

        if (token) {
          if (checkTokenExpiration(token)) {
            navigate('/register');  // Redirect to login if the token is expired
            return Promise.reject('Token expired, redirecting to login...');
          } else {
            config.headers['Authorization'] = `Bearer ${token}`;  // Attach the token to the headers
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);  // Handle request errors
      }
    );

    // Add a background timer to check token expiration every 1 minute
    const tokenCheckInterval = setInterval(() => {
      const token = localStorage.getItem('access');
      if (token && checkTokenExpiration(token)) {
        console.log('Token expired, redirecting to login');
        navigate('/register');  // Redirect to login when token expires
        clearInterval(tokenCheckInterval);  // Stop the interval after redirecting
      }
    }, 60000);  // Check every 1 minute

    // Cleanup the interval when the component unmounts
    return () => clearInterval(tokenCheckInterval);
  }, [navigate]);

};

export default useAxiosInterceptors;

