import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getActivity } from "../services/api";

function ActivityList() {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    getActivity()
      .then((response) => {
        if (!cancelled) {
          setActivities(response.data);
        }
      })
      .catch((error) => console.error(error));

    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <Grid container spacing={2}>
      {activities.map((activity) => (
        <Grid key={activity.id} item xs={12} sm={6} md={4}>
          <Card sx={{ cursor: "pointer" }}
          onClick = {()=> navigate(`/activities/${activity.id}`)}
          >
            <CardContent>
              <Typography variant="h6"> {activity.type}</Typography>
              <Typography>Duration: {activity.duration}</Typography>
              <Typography>Calorie: {activity.caloriesBurned}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default ActivityList;
