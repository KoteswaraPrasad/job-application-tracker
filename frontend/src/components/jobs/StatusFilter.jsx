import React, {
  useState, useEffect, useCallback, forwardRef, useImperativeHandle,
} from 'react';
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Divider,
  Button,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import JobsList from './JobsList';
import AddJob from './AddJob';
import jobsAPI from '../../utils/Appi';
import setAuthToken from '../../utils/setAuthToken';

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
];

const StatusFilter = forwardRef(({ onJobAction }, ref) => {
  const [status, setStatus] = useState('all');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return setLoading(false);
      setAuthToken(token);
      const res =
        status === 'all'
          ? await jobsAPI.getJobs()
          : await jobsAPI.getJobsByStatus(status);
      setJobs(res.jobs);
    } catch (err) {
      console.error('Fetch Jobs Error:', err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useImperativeHandle(ref, () => ({ refreshJobs: fetchJobs }), [fetchJobs]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleStatusChange = (_, newStatus) => {
    if (newStatus) setStatus(newStatus);
  };

  const handleJobActionComplete = () => {
    setShowAddForm(false);
    fetchJobs();
    if (onJobAction) onJobAction();
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        mb={2}
      >
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          Your Job Applications
        </Typography>
        {!showAddForm && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowAddForm(true)}
            sx={{ mt: { xs: 1, sm: 0 } }}
          >
            Add Job
          </Button>
        )}
      </Box>

      <Box mb={3}>
        <ToggleButtonGroup
          value={status}
          onChange={handleStatusChange}
          exclusive
          aria-label="status filter"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            mt: 1,
            '& .MuiToggleButton-root': {
              borderRadius: '20px',
              textTransform: 'capitalize',
              fontWeight: 500,
              px: 2.5,
              py: 1,
              color: 'text.secondary',
              borderColor: 'rgba(255,255,255,0.1)',
            },
            '& .Mui-selected': {
              backgroundColor: 'primary.main',
              color: '#fff',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            },
          }}
        >
          {statusOptions.map((option) => (
            <ToggleButton key={option.value} value={option.value}>
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

      {showAddForm && (
        <Box mb={3}>
          <AddJob
            onJobAdded={handleJobActionComplete}
            onCancel={() => setShowAddForm(false)}
          />
        </Box>
      )}

      <JobsList
        jobs={jobs}
        loading={loading}
        onJobActionComplete={handleJobActionComplete}
      />
    </Paper>
  );
});

export default StatusFilter;
