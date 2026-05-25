import { useState, useEffect, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { Timeline as MuiTimeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent, TimelineOppositeContent } from '@mui/lab';
import { Check as CheckIcon, Close as CloseIcon, HourglassEmpty as HourglassIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import jobsAPI from '../../utils/Appi';

const statusIcons = {
  applied: <HourglassIcon />,
  interview: <HourglassIcon />,
  offer: <CheckIcon color="success" />,
  rejected: <CloseIcon color="error" />,
};

const Timeline = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const jobsData = await jobsAPI.getJobs(token);
      setJobs(jobsData.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)));
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  if (loading) return <Typography>Loading timeline...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Application Timeline</Typography>
      {jobs.length === 0 ? (
        <Typography>No job applications yet.</Typography>
      ) : (
        <MuiTimeline position="alternate">
          {jobs.map((job) => (
            <TimelineItem key={job._id}>
              <TimelineOppositeContent color="text.secondary">
                {format(new Date(job.appliedDate), 'MMM dd, yyyy')}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color={job.status === 'offer' ? 'success' : job.status === 'rejected' ? 'error' : 'primary'}>
                  {statusIcons[job.status]}
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h6" component="span">{job.company}</Typography>
                <Typography>{job.role}</Typography>
                <Typography color="text.secondary">
                  Status: {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </MuiTimeline>
      )}
    </Box>
  );
};

export default Timeline;