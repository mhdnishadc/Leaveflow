import React from 'react';
import './App.css'
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login'
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ApplyLeave from './pages/ApplyLeave';
import LeaveStatus from './pages/LeaveStatus';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ManageEmployee from './pages/ManageEmployee';










const App = () => {


  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Login />} /> {/* Default route */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/apply-leave" element={<ApplyLeave />} />
      <Route path="/leave-status" element={<LeaveStatus />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin/manage-employee" element={<ManageEmployee />} />
    </Routes>

  )
}

export default App
