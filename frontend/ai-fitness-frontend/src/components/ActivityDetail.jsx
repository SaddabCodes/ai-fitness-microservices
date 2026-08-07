import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getActivityDetail } from "../services/api";

const activityEmojis = {
  RUNNING: "🏃",
  WALKING: "🚶",
  CARDIO: "💓",
  WEIGHT_TRAINING: "🏋️",
  YOGA: "🧘",
  SWIMMING: "🏊",
  HIIT: "⚡",
};

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let retryTimer;

    const fetchActivityDetail = async () => {
      try {
        const response = await getActivityDetail(id);
        if (cancelled) return;

        if (response.status === 202) {
          setAttempts((prev) => prev + 1);
          if (attempts < 15) {
            retryTimer = window.setTimeout(fetchActivityDetail, 2000);
          } else {
            setError("The AI recommendation is taking longer than expected. Please try again.");
            setLoading(false);
          }
          return;
        }

        setActivity(response.data);
        setLoading(false);
        setError(null);
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          setError("Unable to load activity details. Please try again.");
          setLoading(false);
        }
      }
    };

    fetchActivityDetail();

    return () => {
      cancelled = true;
      window.clearTimeout(retryTimer);
    };
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography color="textSecondary">
            Generating AI recommendation... {attempts > 0 && `(Attempt ${attempts})`}
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate("/activities")}>
          Back to Activities
        </Button>
      </Container>
    );
  }

  if (!activity) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Activity not found
        </Alert>
        <Button variant="contained" onClick={() => navigate("/activities")}>
          Back to Activities
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        onClick={() => navigate("/activities")}
        sx={{ mb: 3, fontWeight: 600 }}
      >
        ← Back to Activities
      </Button>

      <Card sx={{ mb: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Typography variant="h3" sx={{ mr: 2, lineHeight: 1 }}>
              {activityEmojis[activity.type] || "🏆"}
            </Typography>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {activity.type}
              </Typography>
              <Typography color="textSecondary">
                {new Date(activity.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
            <Box>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 1 }}>
                Duration
              </Typography>
              <Typography variant="h6">⏱️ {activity.duration} minutes</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 1 }}>
                Calories Burned
              </Typography>
              <Typography variant="h6">🔥 {activity.caloriesBurned} kcal</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {activity?.recommendation && (
        <Card sx={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
              🤖 AI Recommendation
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                📋 Analysis
              </Typography>
              <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
                {activity.recommendation}
              </Typography>
            </Box>

            {activity?.improvements && activity.improvements.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    💪 Improvements
                  </Typography>
                  {activity.improvements.map((improvement, index) => (
                    <Typography key={index} sx={{ mb: 1, lineHeight: 1.7 }}>
                      • {improvement}
                    </Typography>
                  ))}
                </Box>
              </>
            )}

            {activity?.suggestions && activity.suggestions.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    💡 Suggestions
                  </Typography>
                  {activity.suggestions.map((suggestion, index) => (
                    <Typography key={index} sx={{ mb: 1, lineHeight: 1.7 }}>
                      • {suggestion}
                    </Typography>
                  ))}
                </Box>
              </>
            )}

            {activity?.safety && activity.safety.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    ⚠️ Safety Guidelines
                  </Typography>
                  {activity.safety.map((safety, index) => (
                    <Typography key={index} sx={{ mb: 1, lineHeight: 1.7 }}>
                      • {safety}
                    </Typography>
                  ))}
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default ActivityDetail;
