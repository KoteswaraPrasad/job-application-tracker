import React, { useContext, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';

const Home = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 128px)',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to Job Application Tracker
      </Typography>
      <Typography variant="h5" component="p" sx={{ mb: 4 }}>
        Organize your job search, track applications, and never miss an update.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" size="large" component={Link} to="/register">
          Get Started
        </Button>
        <Button variant="outlined" size="large" component={Link} to="/login">
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
