import React, { useEffect, useState } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import Papa from 'papaparse';
import styled from 'styled-components'; // Import styled-components for better styling

const LineChart = ({ csvFile }) => {
  const [data, setData] = useState([]);
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set theme based on system preference
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(matchMedia.matches ? "dark" : "light");

    const handleThemeChange = (e) => {
      setTheme(e.matches ? "dark" : "light");
    };

    matchMedia.addEventListener("change", handleThemeChange);

    // Parse the CSV file
    const parseCSV = async () => {
      try {
        const response = await fetch(csvFile);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder("utf-8");
        const csvData = decoder.decode(result.value);

        Papa.parse(csvData, {
          header: true,
          complete: (results) => {
            const formattedData = results.data.map(item => ({
              hour: item.hour,
              messages: parseInt(item.messages, 10) || 0,
            }));
            setData(formattedData);
            setLoading(false);
          },
          error: (error) => {
            console.error("Error parsing CSV file:", error);
            setError("Error parsing CSV data");
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("Error fetching CSV file:", error);
        setError("Error fetching CSV file");
        setLoading(false);
      }
    };

    parseCSV();

    return () => {
      matchMedia.removeEventListener("change", handleThemeChange);
    };
  }, [csvFile]);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <ChartContainer className={theme}>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />
          <XAxis
            dataKey="hour"
            label={{ value: 'Hour', position: 'insideBottomRight', offset: -5 }} // X-axis label
            tick={{ fill: "var(--axis-color)" }}
            padding={{ left: 10, right: 10 }} // Adds padding on the sides
          />
          <YAxis
            label={{ value: 'Messages', angle: -90, position: 'insideLeft', offset: 10 }} // Y-axis label
            tick={{ fill: "var(--axis-color)" }}
          />
          <Tooltip
            cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg)',
              border: 'none',
              color: 'var(--tooltip-color)',
            }}
            wrapperStyle={{ zIndex: 10 }} // Ensures tooltip appears above other elements
          />
          <Line
            type="monotone"
            dataKey="messages"
            stroke="var(--line-color)"
            strokeWidth={2}
            dot={{ r: 4, fill: "var(--line-color)" }}
            className="animated-line"
          />
        </RechartsLineChart>
      </ResponsiveContainer>
      <Style theme={theme} />
    </ChartContainer>
  );
};

// Styled components for LineChart
const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &.light {
    --line-color: #43e5f4; /* Light theme line color */
    --axis-color: #333333; /* Light theme axis color */
    --grid-color: rgba(0, 0, 0, 0.1); /* Light theme grid color */
    --tooltip-bg: #f0f0f0; /* Light theme tooltip background */
    --tooltip-color: #333333; /* Light theme tooltip text color */
  }

  &.dark {
    --line-color: #43e5f4; /* Dark theme line color */
    --axis-color: #dcdcdc; /* Dark theme axis color */
    --grid-color: rgba(220, 220, 220, 0.1); /* Dark theme grid color */
    --tooltip-bg: #1a1a1a; /* Dark theme tooltip background */
    --tooltip-color: #ffffff; /* Dark theme tooltip text color */
  }
`;

const Style = styled.div`
  .animated-line {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: drawLine 8s ease-in-out forwards infinite;
    filter: drop-shadow(0 0 5px rgba(80, 185, 255, 0.7));
  }

  @keyframes drawLine {
    0% {
      stroke-dashoffset: 1000;
    }
    50% {
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dashoffset: 1000;
    }
  }
`;

export default LineChart;
