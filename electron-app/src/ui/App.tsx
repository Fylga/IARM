import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { EmergencyProvider } from '../contexts/EmergencyContext';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import LoginPage from '../features/auth/LoginPage';
// import RegisterPage from '../features/auth/RegisterPage';
import EmergencyCallsList from '../features/emergency/EmergencyCallsList';
import UsersList from '../features/admin/UsersList';
import MainLayout from '../components/layout/MainLayout';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <EmergencyProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<EmergencyCallsList />} />
              </Route>
            </Route>
            <Route element={<ProtectedRoute requireAdmin={true} />}>
              <Route element={<MainLayout />}>
                <Route path="/admin/users" element={<UsersList />} />
              </Route>
            </Route>
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </Router>
      </EmergencyProvider>
    </AuthProvider>
  );
}

export default App;
