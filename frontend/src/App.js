import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import { AlertProvider } from './context/alertContext';
import Navbar from './components/layout/Navbar';
import Alert from './components/layout/Alert';
import PrivateRoute from './components/layout/PrivateRoute';

import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './components/Dashboard';
import Timeline from './pages/Timeline';

import { setAppiAuthToken } from './utils/Appi';

const token = localStorage.getItem('token');
if (token) setAppiAuthToken(token);

function App() {
  return (
    <Router>
      <AuthProvider>
        <AlertProvider>
          <Navbar />
          <Alert />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/timeline" element={<Timeline />} />
            </Route>
          </Routes>
        </AlertProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
