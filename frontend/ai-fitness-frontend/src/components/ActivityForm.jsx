import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import { addActivity } from "../services/api";

const activityEmojis = {
  RUNNING: "🏃",
  WALKING: "🚶",
  CARDIO: "💓",
  WEIGHT_TRAINING: "🏋️",
  YOGA: "🧘",
  SWIMMING: "🏊",
  HIIT: "⚡",
};

function ActivityForm({ onActivitiesAdded }) {
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 19);
  };

  const [activity, setActivity] = useState({
    type: "RUNNING",
    duration: 0,
    caloriesBurned: 0,
    additionalMetrics: {},
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const activityWithTime = {
        ...activity,
        startTime: getCurrentDateTime(),
      };
      await addActivity(activityWithTime);
      setSuccess("Activity logged successfully! 🎉");
      onActivitiesAdded();
      setActivity({
        type: "RUNNING",
        duration: 0,
        caloriesBurned: 0,
        additionalMetrics: {},
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error(error);
      const errorData = error.response?.data;
      const responseMessage =
        errorData?.error ||
        errorData?.message ||
        (errorData?.errors ? Object.values(errorData.errors)[0] : null);
      setError(
        responseMessage || "Unable to add activity. Please sign in again and retry."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "none",
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {success}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Activity Type</InputLabel>
                <Select
                  value={activity.type}
                  label="Activity Type"
                  onChange={(e) => {
                    setActivity({ ...activity, type: e.target.value });
                  }}
                >
                  <MenuItem value="RUNNING">🏃 Running</MenuItem>
                  <MenuItem value="WALKING">🚶 Walking</MenuItem>
                  <MenuItem value="CARDIO">💓 Cardio</MenuItem>
                  <MenuItem value="WEIGHT_TRAINING">🏋️ Weight Training</MenuItem>
                  <MenuItem value="YOGA">🧘 Yoga</MenuItem>
                  <MenuItem value="SWIMMING">🏊 Swimming</MenuItem>
                  <MenuItem value="HIIT">⚡ HIIT</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                inputProps={{ min: 0 }}
                value={activity.duration}
                onChange={(e) =>
                  setActivity({
                    ...activity,
                    duration: parseInt(e.target.value) || 0,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Calories Burned"
                type="number"
                inputProps={{ min: 0 }}
                value={activity.caloriesBurned}
                onChange={(e) =>
                  setActivity({
                    ...activity,
                    caloriesBurned: parseInt(e.target.value) || 0,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} sx={{ display: "flex", alignItems: "flex-end" }}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5568d3 0%, #653a91 100%)",
                  },
                  "&:disabled": {
                    opacity: 0.6,
                  },
                }}
              >
                {loading ? "Logging..." : `${activityEmojis[activity.type]} Log Activity`}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ActivityForm;


