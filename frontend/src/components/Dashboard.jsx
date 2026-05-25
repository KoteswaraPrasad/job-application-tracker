import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  Tabs,
  Tab,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { BarChart, CheckCircle, Cancel, Work } from "@mui/icons-material";

import StatusFilter from "../components/jobs/StatusFilter";
import jobsAPI from "../utils/Appi";
import AlertContext from "../context/alertContext";
import AuthContext from "../context/authContext";

const StatCard = ({ title, count, icon, color }) => (
  <Card
    sx={{
      p: 3,
      borderRadius: 3,
      background: `linear-gradient(135deg, ${color} 30%, #222831)`,
      color: "#fff",
      height: "100%",
      display: "flex",
      alignItems: "center",
      gap: 2,
    }}
  >
    <Box
      sx={{
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: "50%",
        p: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="h6" fontWeight={600}>
        {count}
      </Typography>
      <Typography variant="body2">{title}</Typography>
    </Box>
  </Card>
);

const Dashboard = () => {
  const { setAlert } = useContext(AlertContext);
  const {
    user,
    loading: authLoading,
    isReturningUser,
  } = useContext(AuthContext);

  const [stats, setStats] = useState({
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    total: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);

  const fetchJobStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await jobsAPI.getJobStats();
      setStats(res.stats);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setAlert(err.response?.data?.msg || "Error loading stats", "error");
    } finally {
      setStatsLoading(false);
    }
  }, [setAlert]);

  useEffect(() => {
    if (!authLoading) fetchJobStats();
  }, [authLoading, fetchJobStats]);

  useEffect(() => {
    const showTimer = setTimeout(() => setShowWelcome(true), 3000);
    const hideTimer = setTimeout(() => setShowWelcome(false), 7000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (authLoading)
    return (
      <Box p={5}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4 },
        py: 3,
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      {showWelcome && user && (
        <Snackbar
          open
          autoHideDuration={4000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            {isReturningUser
              ? `Welcome back, ${user.name}!`
              : `Welcome, ${user.name}!`}
          </Alert>
        </Snackbar>
      )}

      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        color="text.primary"
      >
        Job Tracker Dashboard
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{
          mb: 3,
          "& .MuiTabs-indicator": {
            backgroundColor: "primary.main",
            height: 3,
            borderRadius: 2,
          },
          "& .MuiTab-root": {
            fontWeight: 600,
            textTransform: "capitalize",
            fontSize: 16,
            color: "text.secondary",
            "&.Mui-selected": {
              color: "primary.main",
            },
          },
        }}
      >
        <Tab label="Overview" />
        <Tab label="Applications" />
      </Tabs>

      <Divider sx={{ mb: 4, borderColor: "rgba(255,255,255,0.1)" }} />

      {activeTab === 0 && (
        <>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Overview of your job search
          </Typography>
          {statsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total"
                  count={stats.total}
                  icon={<BarChart />}
                  color="#6D9886"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Applied"
                  count={stats.applied}
                  icon={<Work />}
                  color="#0288d1"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Interview"
                  count={stats.interview}
                  icon={<Work />}
                  color="#f9a825"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Offers"
                  count={stats.offer}
                  icon={<CheckCircle />}
                  color="#43a047"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Rejected"
                  count={stats.rejected}
                  icon={<Cancel />}
                  color="#e53935"
                />
              </Grid>
            </Grid>
          )}
        </>
      )}

      {activeTab === 1 && (
        <Box mt={3}>
          <StatusFilter onJobAction={fetchJobStats} />
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
