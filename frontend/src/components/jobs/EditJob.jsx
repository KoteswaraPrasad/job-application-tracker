import {
  Box, Typography, TextField, Button, IconButton, Paper,
  FormControl, InputLabel, Select, MenuItem, FormHelperText
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect, useCallback, useContext } from 'react';
import jobsAPI from '../../utils/Appi';
import AlertContext from '../../context/alertContext';

const statusOptions = [
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
];

const EditJob = ({ job, onJobUpdated, onJobDeleted, onCancel }) => {
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
      resume: null
    },
    validationSchema: Yup.object({
      company: Yup.string().required('Company is required'),
      role: Yup.string().required('Role is required'),
      status: Yup.string().required('Status is required'),
      interviewDate: Yup.date().nullable().when('status', {
        is: 'interview',
        then: (schema) => schema.required('Interview date is required for interview status'),
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
        const response = await jobsAPI.updateJob(job._id, formData);
        onJobUpdated(response.job);
        setAlert('Job updated successfully', 'success');
      } catch (err) {
        console.error('Error updating job:', err);
        setAlert(err.response?.data?.msg || 'Error updating job', 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (job) {
      formik.setValues({
        company: job.company,
        role: job.role,
        status: job.status,
        interviewDate: job.interviewDate ? new Date(job.interviewDate) : null,
        notes: job.notes || '',
        contact: job.contact || '',
        source: job.source || '',
        resume: null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job]);

  const handleDelete = useCallback(async () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobsAPI.deleteJob(job._id);
        onJobDeleted(job._id);
        setAlert('Job deleted successfully', 'success');
      } catch (err) {
        console.error('Error deleting job:', err);
        setAlert(err.response?.data?.msg || 'Error deleting job', 'error');
      }
    }
  }, [job?._id, onJobDeleted, setAlert]);

  if (!job) return null;

  return (
    <Paper elevation={4} sx={{ p: 4, borderRadius: 3, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Edit Job</Typography>
        <IconButton onClick={handleDelete} color="error">
          <DeleteIcon />
        </IconButton>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth label="Company" name="company" margin="normal"
          value={formik.values.company}
          onChange={formik.handleChange}
          error={formik.touched.company && Boolean(formik.errors.company)}
          helperText={formik.touched.company && formik.errors.company}
        />
        <TextField
          fullWidth label="Role" name="role" margin="normal"
          value={formik.values.role}
          onChange={formik.handleChange}
          error={formik.touched.role && Boolean(formik.errors.role)}
          helperText={formik.touched.role && formik.errors.role}
        />

        <FormControl fullWidth margin="normal" error={formik.touched.status && Boolean(formik.errors.status)}>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            label="Status"
            value={formik.values.status}
            onChange={formik.handleChange}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </Select>
          <FormHelperText>{formik.touched.status && formik.errors.status}</FormHelperText>
        </FormControl>

        {formik.values.status === 'interview' && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Interview Date"
              value={formik.values.interviewDate}
              onChange={(date) => formik.setFieldValue('interviewDate', date)}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </LocalizationProvider>
        )}

        <TextField fullWidth name="contact" label="Contact (optional)" margin="normal" value={formik.values.contact} onChange={formik.handleChange} />
        <TextField fullWidth name="source" label="Source (optional)" margin="normal" value={formik.values.source} onChange={formik.handleChange} />
        <TextField fullWidth multiline rows={3} name="notes" label="Notes (optional)" margin="normal" value={formik.values.notes} onChange={formik.handleChange} />

        <Button component="label" fullWidth sx={{ mt: 2 }} variant="outlined">
          Upload Resume
          <input hidden type="file" accept="application/pdf" onChange={(e) => formik.setFieldValue('resume', e.currentTarget.files[0])} />
        </Button>

        {formik.values.resume && <Typography variant="body2" mt={1}>{formik.values.resume.name}</Typography>}

        <Box display="flex" gap={2} mt={3}>
          <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Job'}
          </Button>
          <Button variant="outlined" color="secondary" fullWidth onClick={onCancel}>
            Cancel
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default EditJob;
