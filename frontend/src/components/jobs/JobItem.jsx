import {
  Card,
  Typography,
  Chip,
  IconButton,
  Box,
  Collapse,
  Tooltip,
  Stack,
  Divider,
  Grid,
} from "@mui/material";
import {
  Edit,
  Delete,
  ExpandMore,
  ExpandLess,
  CalendarToday,
  Email,
  Link,
  Note,
} from "@mui/icons-material";
import { useState, useContext } from "react";
import { format } from "date-fns";
import jobsAPI from "../../utils/Appi";
import AlertContext from "../../context/alertContext";

const statusColors = {
  applied: "info",
  interview: "warning",
  offer: "success",
  rejected: "error",
};

const JobItem = ({ job, onEditClick, onDeleteClick }) => {
  const [expanded, setExpanded] = useState(false);
  const { setAlert } = useContext(AlertContext);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await jobsAPI.deleteJob(job._id);
      setAlert("Job deleted successfully", "success");
      onDeleteClick(job._id);
    } catch (err) {
      console.error("Delete Error:", err);
      setAlert(err.response?.data?.msg || "Failed to delete job", "error");
    }
  };

  return (
    <Grid
      columns={12}
      gridColumn={{ xs: "span 12", sm: "span 6", md: "span 4" }}
    >
      <Card
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 3,
          height: "100%",
          bgcolor: "background.paper",
        }}
      >
        <Stack spacing={1}>
          {/* Top: Role + Company + Status */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {job.role}
              </Typography>
              <Typography
                variant="subtitle1"
                fontWeight={500}
                color="primary.main"
              >
                {job.company}
              </Typography>
              <Chip
                label={job.status}
                color={statusColors[job.status]}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>

            {/* Icons */}
            <Box>
              <Tooltip title="Edit">
                <IconButton onClick={() => onEditClick(job)} size="small">
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={handleDelete} size="small" color="error">
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={expanded ? "Hide Details" : "Show Details"}>
                <IconButton onClick={() => setExpanded(!expanded)} size="small">
                  {expanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Typography
            variant="body2"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <CalendarToday fontSize="small" />
            Applied: {format(new Date(job.appliedDate), "MMM dd, yyyy")}
          </Typography>

          {job.interviewDate && (
            <Typography
              variant="body2"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <CalendarToday fontSize="small" />
              Interview: {format(new Date(job.interviewDate), "MMM dd, yyyy")}
            </Typography>
          )}

          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box mt={1}>
              {job.contact && (
                <Typography
                  variant="body2"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Email fontSize="small" /> {job.contact}
                </Typography>
              )}
              {job.source && (
                <Typography
                  variant="body2"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Link fontSize="small" /> {job.source}
                </Typography>
              )}
              {job.notes && (
                <Typography
                  variant="body2"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Note fontSize="small" /> {job.notes}
                </Typography>
              )}
              {job.resume && (
                <Typography
                  variant="body2"
                  sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
                >
                  📄{" "}
                  <a
                    href={`http://localhost:5000/${job.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#1976d2",
                      fontWeight: 500,
                      textDecoration: "none",
                    }}
                  >
                    View Resume
                  </a>
                </Typography>
              )}
            </Box>
          </Collapse>
        </Stack>
      </Card>
    </Grid>
  );
};

export default JobItem;
