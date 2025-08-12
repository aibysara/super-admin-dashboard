import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SuperLogin from './components/SuperLogin';
import UserLogin from './components/UserLogin';
import AdminDashboard from './components/AdminDashboard';
import Home from './components/Home'; // ✅ Import real Home.jsx
import SuperAdminLogin from './components/SuperLogin';
function UserPage() {
  return <h1>User Page (Normal users only)</h1>;
}



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/superadmin" element={<SuperLogin />} />
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-page" element={<UserPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
