import React, { useEffect, useState } from "react";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import { csv } from "d3-fetch";

// Import your individual graph components
import BarChart from "../BarChart";
import LineChart from "../LineChart";

const PostAnalyticsGraph = ({ postBarChartCsvFile, postLineChartCsvFile, isExpanded }) => {
  const [postBarChartData, setPostBarChartData] = useState([]);
  const [postLineChartData, setPostLineChartData] = useState([]);

  // Function to fetch and parse CSV data
  const fetchData = async (file, setData) => {
    try {
      const data = await csv(file);
      setData(data);
    } catch (error) {
      console.error(`Error fetching ${file}:`, error);
    }
  };

  useEffect(() => {
    fetchData(postBarChartCsvFile, setPostBarChartData);
    fetchData(postLineChartCsvFile, setPostLineChartData);
  }, [postBarChartCsvFile, postLineChartCsvFile]);

  return (
    <Box sx={{ padding: 2, transition: "height 0.5s ease" }}>
      <Grid container spacing={2}>
        {/* Bar Chart */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: isExpanded ? "100%" : "200px", overflow: "hidden" }}>
            <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" gutterBottom>
                Post Engagement Bar Chart
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <BarChart data={postBarChartData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Line Chart */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: isExpanded ? "100%" : "200px", overflow: "hidden" }}>
            <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" gutterBottom>
                Engagement Trends Line Chart
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <LineChart data={postLineChartData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PostAnalyticsGraph;
