import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { jwtDecode } from 'jwt-decode';
import { setAppiAuthToken } from '../utils/Appi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setAppiAuthToken(null);
    navigate('/login');
  };

  const login = async (formData) => {
    try {
      const res = await api.post('/auth/login', formData);
      const { token } = res.data;
      localStorage.setItem('token', token);
      setAppiAuthToken(token);
      const decoded = jwtDecode(token);
      setUser(decoded.user);
      setIsAuthenticated(true);
      setIsReturningUser(false);
      return { success: true, token };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      return { success: true, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Registration failed',
      };
    }
  };

  const checkToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        logout();
      } else {
        setAppiAuthToken(token);
        setUser(decoded.user);
        setIsAuthenticated(true);
        setIsReturningUser(true);
      }
    } catch (err) {
      logout();
    }
    setLoading(false);
  };

  useEffect(() => {
    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        user,
        isReturningUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;