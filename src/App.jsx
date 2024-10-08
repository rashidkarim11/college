import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/register";
import Home from "./pages/home";
import NotFound from "./pages/notFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/login";
import ConfirmEmailNotice from "./pages/emailconfirm";
import ConfirmEmail from "./components/handleEmailConfirm";
import Cal from "./pages/cal";
import useAxiosInterceptors from "./components/jwtexpcheck";
import CollegeListPage from './pages/CollegeListPage';

function Logout() {
  localStorage.clear();
  return <Navigate to="/register" />;
}

// Create a new component to handle routes and only use interceptors on protected routes
function AppWithInterceptors() {
  useAxiosInterceptors();  // Correctly calling the hook, not rendering it as JSX

  return (
    <Routes>
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/collegelist"
        element={
          <ProtectedRoute>
            <CollegeListPage />
          </ProtectedRoute>
        }
      />
      
      <Route path="/logout" element={<Logout />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/emailconfirm" element={<ConfirmEmailNotice />} />
      <Route path="/handleEmailConfirm/:token" element={<ConfirmEmail />} />
      <Route
        path="/cal"
        element={
          <ProtectedRoute>
            <Cal />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    // Wrap the entire app with BrowserRouter so hooks like useNavigate can work
    <BrowserRouter>
      <AppWithInterceptors />
    </BrowserRouter>
  );
}

export default App;
