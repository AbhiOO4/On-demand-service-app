import "./App.css";
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import ServiceRequest from './pages/ServiceRequest';
import Services from "./pages/Services";
import Profile from './pages/Profile';
import Workersignup from "./pages/Workersignup";
import WorkerLogin from "./pages/WorkerLogin";

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <div className="pt-16"> {/* Add padding-top to account for fixed navbar */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/services" element={<Services />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute userType="customer">
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer/dashboard"
              element={
                <PrivateRoute userType="customer">
                  <CustomerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/worker/dashboard"
              element={
                <PrivateRoute userType="worker">
                  <WorkerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/service/request"
              element={
                <PrivateRoute userType="customer">
                  <ServiceRequest />
                </PrivateRoute>
              }
            />
            <Route path="/Workersignup" element={<Workersignup />} />
            <Route path="/WorkerLogin" element={<WorkerLogin />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
