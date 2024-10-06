import React, { useEffect, useState } from "react";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import { csv } from "d3-fetch";

// Import your individual graph components
import LineChart from "../LineChart";
import HeatMap from "../HeatMap";

const BotAnalyticsGraph = ({
  lineChartCsvFile, // CSV file for LineChart
  heatMapCsvFile,   // CSV file for HeatMap
  isExpanded,
}) => {
  const [lineChartData, setLineChartData] = useState([]);
  const [heatMapData, setHeatMapData] = useState([]);

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
    fetchData(lineChartCsvFile, setLineChartData);
    fetchData(heatMapCsvFile, setHeatMapData);
  }, [lineChartCsvFile, heatMapCsvFile]);

  return (
    <Box sx={{ padding: 2, transition: "height 0.5s ease" }}>
      <Grid container spacing={2}>
        {/* Line Chart */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: isExpanded ? "100%" : "200px", overflow: "hidden" }}>
            <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" gutterBottom>
                User Satisfaction Ratings Over Time
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <LineChart data={lineChartData} /> {/* Pass parsed data for LineChart */}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Heat Map */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: isExpanded ? "100%" : "200px", overflow: "hidden" }}>
            <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" gutterBottom>
                Peak Interaction Times with Bots
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <HeatMap csvFile={heatMapData} theme={isExpanded ? 'dark' : 'light'} /> {/* Pass parsed data for HeatMap */}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BotAnalyticsGraph;
