import React, { useState } from "react";
import { Box, IconButton, Typography, Button, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import PieChart from "../../components/PieChart";
import StatBox from "../../components/StatBox";
import HeatMap from "../../components/HeatMap";
import csvFile from "../../csvData/hours_messages.csv";
import daily_file from "../../csvData/daily_member_growth.csv";
import LineGraph from "../../components/LineChart";
import StackedBarChart from "../../components/StackedBarChart";
import stackedfile from "../../csvData/day_wise_reaction.csv";
import WorldMap from "../../components/WorldMap";
import SentimentMeter from "../../components/SentimentMeter";
import worldcsv from "../../csvData/worldmap.csv";
import heatmapcsv from "../../csvData/messages_data-2.csv";
import "../../css/AnimatedBox.css";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const titleColor =
    theme.palette.mode === "dark" ? colors.grey[100] : colors.grey[200];
  const subtitleColor =
    theme.palette.mode === "dark" ? colors.grey[400] : colors.grey[500];

  const [timePeriod, setTimePeriod] = useState("daily"); // State to track the selected time period

  return (
    <Box
      sx={{
        marginLeft: "250px", // Match this to the sidebar's expanded width
        padding: "20px", // Add some padding if needed
        height: "100vh", // Full viewport height
        overflowY: "auto", // Allow vertical scrolling
      }}
    >
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title={
            <Typography
              variant="h4"
              fontSize="2rem"
              fontWeight="bolder"
              color={titleColor}
            >
              Telegram Trends
            </Typography>
          }
          subtitle={
            <Typography variant="h6" color={subtitleColor}>
              Building Dreams, Together
            </Typography>
          }
        />

        {/* Time Period Buttons */}
        <Box>
          <Button
            variant={timePeriod === "daily" ? "contained" : "outlined"}
            onClick={() => setTimePeriod("daily")}
            sx={{
              marginRight: "10px",
              backgroundColor:
                timePeriod === "daily" ? colors.green[500] : "transparent",
              color: timePeriod === "daily" ? "white" : colors.green[500],
              fontWeight: "bolder",
              "&:hover": {
                backgroundColor:
                  timePeriod === "daily"
                    ? colors.green[700]
                    : "rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            1D
          </Button>
          <Button
            variant={timePeriod === "weekly" ? "contained" : "outlined"}
            onClick={() => setTimePeriod("weekly")}
            sx={{
              marginRight: "10px",
              backgroundColor:
                timePeriod === "weekly" ? colors.green[500] : "transparent",
              color: timePeriod === "weekly" ? "white" : colors.green[500],
              "&:hover": {
                backgroundColor:
                  timePeriod === "weekly"
                    ? colors.green[700]
                    : "rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            1W
          </Button>
          <Button
            variant={timePeriod === "monthly" ? "contained" : "outlined"}
            onClick={() => setTimePeriod("monthly")}
            sx={{
              backgroundColor:
                timePeriod === "monthly" ? colors.green[500] : "transparent",
              color: timePeriod === "monthly" ? "white" : colors.green[500],
              "&:hover": {
                backgroundColor:
                  timePeriod === "monthly"
                    ? colors.green[700]
                    : "rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            1M
          </Button>
        </Box>
      </Box>

      {/* Main Grid for Charts and Statistics */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
        marginTop="20px"
      >
{/*
                
                <Box gridColumn="span 3" background = "transparent"display="flex" alignItems="center" justifyContent="center" borderRadius = "16px"border={`1px solid ${colors.green[500]}`}>
          <StatBox
            title="1,505,926"
            subtitle="Total Messages"
            progress="0.75"
            increase="+14%"
            icon={<EmailIcon sx={{ color: colors.green[500], fontSize: "26px" }} />}
          />
        </Box>
        <Box gridColumn="span 3" background = "transparent" display="flex" alignItems="center" justifyContent="center"borderRadius = "16px"border={`1px solid ${colors.green[500]}`}>
          <StatBox
            title="38"
            subtitle="Memes Groups"
            progress="0.50"
            increase="+21%"
            icon={<PointOfSaleIcon sx={{ color: colors.green[500], fontSize: "26px" }} />}
          />
        </Box>
        <Box gridColumn="span 3" background = "transparent"display="flex" alignItems="center" justifyContent="center"borderRadius = "16px"border={`1px solid ${colors.green[500]}`}>
          <StatBox
            title="158,886"
            subtitle="Total Participants"
            progress="0.30"
            increase="+5%"
            icon={<PersonAddIcon sx={{ color: colors.green[500], fontSize: "26px" }} />}
          />
        </Box>
        <Box gridColumn="span 3" background = "transparent" display="flex" alignItems="center" justifyContent="center" borderRadius="16px" border={`1px solid ${colors.green[500]}`}>
          <StatBox
            title="197"
            subtitle="Bots"
            progress="0.80"
            increase="+43%"
            icon={<TrafficIcon sx={{ color: colors.green[500], fontSize: "26px" }} />}
          />
        </Box>
*/}
        {/* Bar Chart */}

        <Box
          className="animated-border-box"
          gridColumn="span 8"
          gridRow="span 4"
          borderRadius="16px"
        >
          <Box
            mt="20px"
            p="0 20px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
              Daily Member Growth
            </Typography>
          </Box>
          <Box height="250px" m="20px 0 0 0">
            <BarChart csvFile={daily_file} isDashboard={true} />
          </Box>
        </Box>

        {/* Sentiment Meter */}
        <Box
          className="animated-border-box" // Add this class for animation
          gridColumn="span 4"
          gridRow="span 2"
          background="transparent"
          display="flex"
          justifyContent="center"
          alignItems="center"
          overflow="hidden"
        >
          <Box
            width="90%"
            height="100%"
            maxWidth="900px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <SentimentMeter csvFile={csvFile} data={mockTransactions} />
          </Box>
        </Box>

        {/* Heat Map */}
        <Box
          className="animated-border-box"
          gridColumn="span 4"
          gridRow="span 2"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <HeatMap csvFile={heatmapcsv} data={mockTransactions} />
        </Box>

        {/* Line Chart */}
        <Box
          className="animated-border-box"
          gridColumn="span 4"
          gridRow="span 2"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <LineGraph csvFile={csvFile} isDashboard={true} />
        </Box>

        {/* Stacked Bar Chart */}
        <Box
          className="animated-border-box"
          gridColumn="span 4"
          gridRow="span 2"
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="300px"
        >
          <StackedBarChart csvFile={stackedfile} isDashboard={true} />
        </Box>

        {/* Recent Analytics */}
        <Box
          className="animated-border-box"
          gridColumn="span 4"
          gridRow="span 2"
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Analytics
            </Typography>
          </Box>
          {mockTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p="15px"
            >
              <Typography
                color={colors.greenAccent[100]}
                variant="h5"
                fontWeight="600"
              >
                Group with Maximum Participants: CryptoMoonShots Chat
                加密月球shots (36694)
              </Typography>
            </Box>
          ))}
        </Box>

        {/* New Box Section */}
        <Box
          gridColumn="span 12"
          gridRow="span 0.5"
          backgroundColor="tranparent"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="16px"
          border={`1px solid ${colors.green[500]}`}
        >
          <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
            Daily News
          </Typography>
          <box></box>
        </Box>

        {/* World Map */}
        <Box
          gridColumn="span 12"
          gridRow="span 4"
          borderRadius="16px"
          className="animated-border-box"
        >
          <WorldMap csvFile={worldcsv} backgroundColor="transparent" />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
