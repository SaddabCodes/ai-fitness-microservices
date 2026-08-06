import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { addActivity } from "../services/api";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const activityWithTime = {
        ...activity,
        startTime: getCurrentDateTime(),
      };
      await addActivity(activityWithTime);
      onActivitiesAdded();
      setActivity({
        type: "RUNNING",
        duration: 0,
        caloriesBurned: 0,
        additionalMetrics: {},
      });
    } catch (error) {
      console.error(error);
      const errorData = error.response?.data;
      const responseMessage = errorData?.error || errorData?.message ||
        (errorData?.errors ? Object.values(errorData.errors)[0] : null);
      setError(responseMessage || "Unable to add activity. Please sign in again and retry.");
    }
  };

  return (
    <Box component="form" sx={{ mb: 2 }} onSubmit={handleSubmit}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Activity Type</InputLabel>
        <Select
          value={activity.type}
          onChange={(e) => {
            setActivity({ ...activity, type: e.target.value });
          }}
        >
          <MenuItem value="RUNNING">Running</MenuItem>
          <MenuItem value="WALKING">Walking</MenuItem>
          <MenuItem value="CARDIO">Cardio</MenuItem>
          <MenuItem value="WEIGHT_TRAINING">Weight Training</MenuItem>
          <MenuItem value="YOGA">Yoga</MenuItem>
          <MenuItem value="SWIMMING">Swimming</MenuItem>
          <MenuItem value="HIIT">HIIT</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Duration (minutes)"
        type="number"
        sx={{ mb: 2 }}
        value={activity.duration}
        onChange={(e) =>
          setActivity({ ...activity, duration: parseInt(e.target.value) || 0 })
        }
      ></TextField>

      <TextField
        fullWidth
        label="Calories Burned"
        type="number"
        sx={{ mb: 2 }}
        value={activity.caloriesBurned}
        onChange={(e) =>
          setActivity({
            ...activity,
            caloriesBurned: parseInt(e.target.value) || 0,
          })
        }
      ></TextField>

      <Button type="submit" variant="contained">
        Add Activity
      </Button>
    </Box>
  );
}

export default ActivityForm;


