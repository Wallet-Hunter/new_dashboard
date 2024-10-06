import React, { useEffect, useState } from "react";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import { csv } from "d3-fetch";

// Import your individual graph components
import BarChart from "../BarChart";
import LineChart from "../LineChart";
import HeatMap from "../HeatMap";
import PieChart from "../PieChart";

const GroupBasedAnalyticsGraph = ({
  barChartCsvFile,  // CSV file for BarChart
  lineChartCsvFile, // CSV file for LineChart
  heatMapCsvFile,   // CSV file for HeatMap
  pieChartCsvFile,  // CSV file for PieChart
  isExpanded,
}) => {
  const [barChartData, setBarChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [heatMapData, setHeatMapData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

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
    fetchData(barChartCsvFile, setBarChartData);
    fetchData(lineChartCsvFile, setLineChartData);
    fetchData(heatMapCsvFile, setHeatMapData);
    fetchData(pieChartCsvFile, setPieChartData);
  }, [barChartCsvFile, lineChartCsvFile, heatMapCsvFile, pieChartCsvFile]);

  return (
    <Box sx={{ padding: 2, transition: "height 0.5s ease" }}>
      <Grid container spacing={2}>
        {/* Bar Chart */}
        <Grid item xs={isExpanded ? 6 : 12}>
          <Card sx={{ height: isExpanded ? "100%" : "200px", overflow: "hidden" }}>
            <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" gutterBottom>
                Bar Chart
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <BarChart data={barChartData} /> {/* Pass parsed data for BarChart */}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Line Chart */}
        <Grid item xs={isExpanded ? 6 : 12}>
          <Card sx={{ height: isExpanded ? "100%" : "200px", overflow: "hidden" }}>
            <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" gutterBottom>
                Line Chart
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <LineChart data={lineChartData} /> {/* Pass parsed data for LineChart */}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Heat Map */}
        <Grid item xs={isExpanded ? 6 : 12}>
          <Card sx={{ height: isExpanded ? "100%" : "200px", overflow: "hidden" }}>
            <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" gutterBottom>
                Heat Map
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <HeatMap data={heatMapData} /> {/* Pass parsed data for HeatMap */}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={isExpanded ? 6 : 12}>
          <Card sx={{ height: isExpanded ? "100%" : "200px", overflow: "hidden" }}>
            <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" gutterBottom>
                Pie Chart
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <PieChart data={pieChartData} /> {/* Pass parsed data for PieChart */}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GroupBasedAnalyticsGraph;
