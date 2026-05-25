import axios from 'axios';

const Appi = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  
});

const setAppiAuthToken = (token) => {
  if (token) {
    Appi.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete Appi.defaults.headers.common['x-auth-token'];
  }
};

const jobsAPI = {
  getJobStats: async () => {
    const res = await Appi.get('/jobs/stats');
    return res.data;
  },
  getJobs: async () => {
    const res = await Appi.get('/jobs');
    return res.data;
  },
  getJobsByStatus: async (status) => {
    const res = await Appi.get(`/jobs/status/${status}`);
    return res.data;
  },
  addJob: async (formData) => {
    const res = await Appi.post('/jobs', formData);
    return res.data;
  },
  updateJob: async (id, formData) => {
    const res = await Appi.put(`/jobs/${id}`, formData);
    return res.data;
  },
  deleteJob: async (id) => {
    const res = await Appi.delete(`/jobs/${id}`);
    return res.data;
  },
  downloadResume: async (id) => {
    const res = await Appi.get(`/jobs/resume/${id}`, {
      responseType: 'blob',
    });
    return res;
  },
};

export default jobsAPI; 

export { setAppiAuthToken }; 
