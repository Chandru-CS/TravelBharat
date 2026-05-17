import React, { useState } from 'react';
import AdminDashboard from '../components/AdminDashboard';
import AdminLogin from '../components/AdminLogin';
import './AdminPortal.css';

const AdminPortal = () => {
  const [admin, setAdmin] = useState(null);

  const handleLogin = (adminData) => {
    setAdmin(adminData);
  };

  return (
    <div className="admin-portal">
      {admin ? (
        <AdminDashboard />
      ) : (
        <AdminLogin onLogin={handleLogin} />
      )}
    </div>
  );
};

export default AdminPortal;
