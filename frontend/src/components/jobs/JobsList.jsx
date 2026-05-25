import JobItem from './JobItem';
import AddJob from './AddJob';
import EditJob from './EditJob';
import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';


const JobsList = ({ jobs, loading, onJobActionComplete, showAddForm, onCancelAdd }) => {
  const [editingJob, setEditingJob] = useState(null);

  const handleJobAdded = () => {
    if (onJobActionComplete) onJobActionComplete();
  };

  const handleJobUpdated = () => {
    setEditingJob(null);
    if (onJobActionComplete) onJobActionComplete();
  };

  const handleJobDeleted = (jobId) => {
    if (editingJob && editingJob._id === jobId) {
      setEditingJob(null);
    }
    if (onJobActionComplete) onJobActionComplete();
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      {showAddForm && <AddJob onJobAdded={handleJobAdded} onCancel={onCancelAdd} />}

      {editingJob ? (
  <EditJob
    job={editingJob}
    onJobUpdated={handleJobUpdated}
    onJobDeleted={handleJobDeleted}
    onCancel={() => setEditingJob(null)}
  />
) : jobs.length === 0 ? (
  <Typography>No job applications found</Typography>
) : (
  <Grid container spacing={3} columns={12}>
  {jobs.map((job) => (
    <JobItem
      key={job._id}
      job={job}
      onEditClick={setEditingJob}
      onDeleteClick={handleJobDeleted}
    />
  ))}
</Grid>
)}

    </Box>
  );
};

export default JobsList;
