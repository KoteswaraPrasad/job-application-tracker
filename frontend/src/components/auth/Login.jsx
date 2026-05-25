import { useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Container, 
  Paper 
} from '@mui/material';
import AuthContext from '../../context/authContext';
import AlertContext from '../../context/alertContext';
import { useNavigate } from 'react-router-dom';
import { setAppiAuthToken } from '../../utils/Appi'; 


const Login = () => {
  const { login } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required')
    }),
    onSubmit: async (values) => {
  setIsSubmitting(true);
  try {
    const { success, error, token } = await login(values); 
    if (success) {
      localStorage.setItem('token', token);               
      setAppiAuthToken(token);                            
      setAlert('Login successful!', 'success');
      navigate('/dashboard');
    } else {
      setAlert(error || 'Login failed. Please try again.', 'error');
    }
  } catch (err) {
    setAlert('An unexpected error occurred. Please try again.', 'error');
  } finally {
    setIsSubmitting(false);
  }
}
,
  });

  return (
    
    <Container maxWidth="xs">
      {console.log('Formik values:', formik.values)}

      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            margin="normal"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
  fullWidth
  id="password"
  name="password"
  label="Password"
  type="password"
  margin="normal"
  autoComplete="new-password" 
  value={formik.values.password}
  onChange={(e) => {
    console.log('Typed:', e.target.value); 
    formik.handleChange(e);
  }}
  onBlur={formik.handleBlur}
  error={formik.touched.password && Boolean(formik.errors.password)}
  helperText={formik.touched.password && formik.errors.password}
/>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;