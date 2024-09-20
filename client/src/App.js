import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AdminDash from "./components/AdminDash";
import JobSeeker from "./components/Jobseeker";
import Employer from "./components/Employer";
import Login from "./components/Login";
import Signup from "./components/Signup"; // Import Signup component
import AdminLogin from "./components/AdminLogin"; // Import AdminLogin component
import AdminRegister from "./components/AdminRegister"; // Import AdminRegister component

function App() {
  return (
    <Routes>
      {/* Define the routes for your application */}
      <Route path="/adminDash" element={<AdminDash />} />
      <Route path="/jobseeker" element={<JobSeeker />} />
      <Route path="/employer" element={<Employer />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} /> {/* Add Signup route */}
      <Route path="/adminlogin" element={<AdminLogin />} /> {/* Add AdminLogin route */}
      <Route path="/adminregister" element={<AdminRegister />} /> {/* Add AdminRegister route */}
      
      {/* Redirect any unknown routes to the login page */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
