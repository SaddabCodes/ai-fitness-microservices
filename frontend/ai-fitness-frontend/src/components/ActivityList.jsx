import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid, Box, CircularProgress, Typography, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getActivity } from "../services/api";

const activityEmojis = {
  RUNNING: "🏃",
  WALKING: "🚶",
  CARDIO: "💓",
  WEIGHT_TRAINING: "🏋️",
  YOGA: "🧘",
  SWIMMING: "🏊",
  HIIT: "⚡",
  OTHER: "🏆",
};

function ActivityList() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    getActivity()
      .then((response) => {
        if (!cancelled) {
          setActivities(response.data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError("Failed to load activities");
          setLoading(false);
          console.error(err);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (activities.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          px: 2,
          backgroundColor: "#f5f7fa",
          borderRadius: 3,
          border: "2px dashed #ccc",
        }}
      >
        <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
          No activities yet 📭
        </Typography>
        <Typography color="textSecondary">
          Start tracking your fitness by logging your first activity above!
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {activities.map((activity) => (
        <Grid key={activity.id} item xs={12} sm={6} md={4}>
          <Card
            sx={{
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
              },
              borderRadius: 3,
              overflow: "hidden",
              backgroundColor: "#ffffff",
            }}
            onClick={() => navigate(`/activities/${activity.id}`)}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    mr: 2,
                    lineHeight: 1,
                  }}
                >
                  {activityEmojis[activity.type] || "🏆"}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
                  {activity.type}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                <Chip
                  label={`⏱️ ${activity.duration} min`}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  label={`🔥 ${activity.caloriesBurned} cal`}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              <Typography variant="caption" color="textSecondary" sx={{ display: "block" }}>
                {new Date(activity.startTime).toLocaleDateString()} at{" "}
                {new Date(activity.startTime).toLocaleTimeString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default ActivityList;
