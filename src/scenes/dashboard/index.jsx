import React, { useState } from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import SentimentMeter from "../../components/SentimentMeter";
import HeatMap from "../../components/HeatMap";
import LineGraph from "../../components/LineChart";
import StackedBarChart from "../../components/StackedBarChart";
import WorldMap from "../../components/WorldMap";
import csvFile from "../../csvData/hours_messages.csv";
import daily_file from "../../csvData/daily_member_growth.csv";
import stackedfile from "../../csvData/day_wise_reaction.csv";
import worldcsv from "../../csvData/worldmap.csv";
import heatmapcsv from "../../csvData/messages_data-2.csv";
import "../../css/AnimatedBox.css";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [timePeriod, setTimePeriod] = useState("daily");

  return (
    <Box
      sx={{
        marginLeft: "250px",
        padding: "20px",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title={
            <Typography variant="h4" fontSize="2rem" fontWeight="bolder" color={colors.grey[100]}>
              Telegram Trends
            </Typography>
          }
          subtitle={
            <Typography variant="h6" color={colors.grey[400]}>
              Building Dreams, Together
            </Typography>
          }
        />

        {/* Time Period Buttons */}
        <Box>
          {["daily", "weekly", "monthly"].map((period) => (
            <Button
              key={period}
              variant={timePeriod === period ? "contained" : "outlined"}
              onClick={() => setTimePeriod(period)}
              sx={{
                marginRight: "10px",
                backgroundColor: timePeriod === period ? colors.green[500] : "transparent",
                color: timePeriod === period ? "white" : colors.green[500],
                fontWeight: "bolder",
                "&:hover": {
                  backgroundColor: timePeriod === period ? colors.green[700] : "rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              {period === "daily" ? "1D" : period === "weekly" ? "1W" : "1M"}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Main Grid for Charts and Statistics */}
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px" marginTop="20px">
        {/* Bar Chart */}
        <Box className="animated-border-box" gridColumn="span 8" gridRow="span 4" borderRadius="16px">
          <Box mt="20px" p="0 20px" display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
              Daily Member Growth
            </Typography>
          </Box>
          <Box height="250px" m="20px 0 0 0">
            <BarChart csvFile={daily_file} timeFrame={timePeriod} isDashboard />
          </Box>
        </Box>

        {/* Sentiment Meter */}
        <Box
          className="animated-border-box"
          gridColumn="span 4"
          gridRow="span 2"
          display="flex"
          justifyContent="center"
          alignItems="center"
          overflow="hidden"
        >
          <Box width="90%" height="100%" maxWidth="900px" display="flex" justifyContent="center" alignItems="center">
            <SentimentMeter csvFile={csvFile} timePeriod={timePeriod} />
          </Box>
        </Box>

        {/* Heat Map */}
        <Box className="animated-border-box" gridColumn="span 4" gridRow="span 2" display="flex" justifyContent="center" alignItems="center">
          <HeatMap csvFile={heatmapcsv} timePeriod={timePeriod} />
        </Box>

        {/* Line Chart */}
        <Box className="animated-border-box" gridColumn="span 4" gridRow="span 2" display="flex" justifyContent="center" alignItems="center">
          <LineGraph csvFile={csvFile} timePeriod={timePeriod} isDashboard />
        </Box>

        {/* Stacked Bar Chart */}
        <Box className="animated-border-box" gridColumn="span 4" gridRow="span 2" display="flex" justifyContent="center" alignItems="center" height="300px">
          <StackedBarChart csvFile={stackedfile} timePeriod={timePeriod} isDashboard />
        </Box>

        {/* Recent Analytics */}
        <Box className="animated-border-box" gridColumn="span 4" gridRow="span 2" overflow="auto">
          <Box display="flex" justifyContent="space-between" alignItems="center" p="15px">
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Analytics
            </Typography>
          </Box>
          {mockTransactions.map((transaction, i) => (
            <Box key={`${transaction.txId}-${i}`} display="flex" justifyContent="space-between" alignItems="center" p="15px">
              <Typography color={colors.greenAccent[100]} variant="h5" fontWeight="600">
                Group with Maximum Participants: CryptoMoonShots Chat (36694)
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Daily News */}
        <Box
          gridColumn="span 12"
          gridRow="span 0.5"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="16px"
          border={`1px solid ${colors.green[500]}`}
        >
          <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
            Daily News
          </Typography>
        </Box>

        {/* World Map */}
        <Box gridColumn="span 12" gridRow="span 4" borderRadius="16px" className="animated-border-box">
          <WorldMap csvFile={worldcsv} timePeriod={timePeriod} backgroundColor="transparent" />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
