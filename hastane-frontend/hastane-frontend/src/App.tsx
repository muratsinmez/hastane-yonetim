// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Mevcut sayfalar
import WelcomePage       from './pages/WelcomePage';
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import VerifyPage        from './pages/VerifyPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PatientDashboard  from './pages/PatientDashboard';
import NewAppointment    from './components/NewAppointment';

// Admin sayfaları
import AdminDashboard      from './pages/admin/AdminDashboard';
import AdminPatientsPage   from './pages/admin/AdminPatientsPage';
import AdminDoctorsPage    from './pages/admin/AdminDoctorsPage';

// ▼ Doktor sayfası ekle
import DoctorDashboard from './pages/doctor/DoctorDashboard';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Genel sayfalar */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Hasta paneli */}
        <Route path="/dashboard" element={<PatientDashboard />} />
        <Route path="/new-appointment" element={<NewAppointment />} />

        {/* Admin paneli */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/patients" element={<AdminPatientsPage />} />
        <Route path="/admin/doctors" element={<AdminDoctorsPage />} />

        {/* Doktor paneli */}
        <Route path="/doctor" element={<DoctorDashboard />} />

        {/* Gelecekte ihtiyaç olursa /doctor/appointments gibi alt sayfalar ekleyebilirsin */}
      </Routes>
    </Router>
  );
};

export default App;
