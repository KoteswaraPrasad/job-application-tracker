import { useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField, Button, Box, Typography, Paper,
  FormControl, InputLabel, Select, MenuItem,
  FormHelperText, Stack
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import jobsAPI from '../../utils/Appi';
import AlertContext from '../../context/alertContext';

const statusOptions = [
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
];

const AddJob = ({ onJobAdded, onCancel }) => {
  const { setAlert } = useContext(AlertContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      company: '',
      role: '',
      status: 'applied',
      interviewDate: null,
      notes: '',
      contact: '',
      source: '',
      resume: null,
    },
    validationSchema: Yup.object({
      company: Yup.string().required('Company is required'),
      role: Yup.string().required('Role is required'),
      status: Yup.string().required('Status is required'),
      interviewDate: Yup.date().nullable().when('status', {
        is: 'interview',
        then: (schema) =>
          schema.required('Interview date is required for interview status'),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'resume') {
          formData.append(key, key === 'interviewDate' ? value.toISOString() : value);
        }
        if (key === 'resume' && value) {
          formData.append('resume', value);
        }
      });

      try {
        const response = await jobsAPI.addJob(formData);
        onJobAdded(response.job);
        formik.resetForm();
        setAlert('Job added successfully', 'success');
      } catch (err) {
        console.error('Error adding job:', err);
        setAlert(err.response?.data?.msg || 'Error adding job', 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Paper elevation={4} sx={{ p: 4, borderRadius: 4, backgroundColor: 'background.paper' }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Add New Job
      </Typography>

      <Box component="form" onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          <TextField
            fullWidth label="Company" name="company"
            value={formik.values.company}
            onChange={formik.handleChange}
            error={formik.touched.company && Boolean(formik.errors.company)}
            helperText={formik.touched.company && formik.errors.company}
          />

          <TextField
            fullWidth label="Role" name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            error={formik.touched.role && Boolean(formik.errors.role)}
            helperText={formik.touched.role && formik.errors.role}
          />

          <FormControl fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formik.values.status}
              label="Status"
              onChange={formik.handleChange}
            >
              {statusOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
            {formik.touched.status && formik.errors.status && (
              <FormHelperText>{formik.errors.status}</FormHelperText>
            )}
          </FormControl>

          {formik.values.status === 'interview' && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Interview Date"
                value={formik.values.interviewDate}
                onChange={(date) => formik.setFieldValue('interviewDate', date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={formik.touched.interviewDate && Boolean(formik.errors.interviewDate)}
                    helperText={formik.touched.interviewDate && formik.errors.interviewDate}
                  />
                )}
              />
            </LocalizationProvider>
          )}

          <TextField label="Contact (optional)" name="contact" fullWidth
            value={formik.values.contact} onChange={formik.handleChange} />

          <TextField label="Source (optional)" name="source" fullWidth
            value={formik.values.source} onChange={formik.handleChange} />

          <TextField label="Notes (optional)" name="notes" fullWidth multiline rows={3}
            value={formik.values.notes} onChange={formik.handleChange} />

          <Button variant="outlined" component="label" fullWidth>
            Upload Resume (PDF only)
            <input type="file" hidden accept="application/pdf"
              onChange={(event) => formik.setFieldValue('resume', event.currentTarget.files[0])}
            />
          </Button>

          {formik.values.resume && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected: {formik.values.resume.name}
            </Typography>
          )}

          <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Job'}
          </Button>

          <Button variant="text" color="secondary" onClick={onCancel} fullWidth>
            Cancel
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default AddJob;
