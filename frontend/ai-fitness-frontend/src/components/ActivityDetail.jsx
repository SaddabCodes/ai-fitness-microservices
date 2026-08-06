import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getActivityDetail } from "../services/api";

const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let retryTimer;
    let attempts = 0;

    const fetchActivityDetail = async () => {
      try {
        const response = await getActivityDetail(id);
        if (cancelled) return;

        if (response.status === 202) {
          attempts += 1;
          if (attempts < 15) {
            retryTimer = window.setTimeout(fetchActivityDetail, 2000);
          } else {
            setError("The AI recommendation is taking longer than expected. Please refresh the page.");
          }
          return;
        }

        setActivity(response.data);
        setRecommendation(response.data?.recommendation ?? null);
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          setError("Unable to load the AI recommendation. Please try again.");
        }
      }
    };

    fetchActivityDetail();

    return () => {
      cancelled = true;
      window.clearTimeout(retryTimer);
    };
  }, [id]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!activity) {
    return <Typography>Generating AI recommendation...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Activity Details
          </Typography>
          <Typography>Type: {activity.type}</Typography>
          <Typography>Duration: {activity.duration} minutes</Typography>
          <Typography>Calories Burned: {activity.caloriesBurned}</Typography>
          <Typography>
            Date: {new Date(activity.createdAt).toLocaleString()}
          </Typography>
        </CardContent>
      </Card>

      {recommendation && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              AI Recommendation
            </Typography>
            <Typography variant="h6">Analysis</Typography>
            <Typography sx={{ mb: 2 }}>{activity.recommendation}</Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Improvements</Typography>
            {activity?.improvements?.map((improvement, index) => (
              <Typography key={index} sx={{ mb: 2 }}>
                • {improvement}
              </Typography>
            ))}

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Suggestions</Typography>
            {activity?.suggestions?.map((suggestion, index) => (
              <Typography key={index} sx={{ mb: 2 }}>
                • {suggestion}
              </Typography>
            ))}

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Safety Guidelines</Typography>
            {activity?.safety?.map((safety, index) => (
              <Typography key={index} sx={{ mb: 2 }}>
                • {safety}
              </Typography>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ActivityDetail;
