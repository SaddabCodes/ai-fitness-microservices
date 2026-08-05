import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  return (
    <Box component="form" sx={{ mb: 2 }} onSubmit={handleSubmit}>
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
          <MenuItem value="CYCLING">Cycling</MenuItem>
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


