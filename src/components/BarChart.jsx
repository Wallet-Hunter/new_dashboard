import React, { useState, useEffect, useCallback } from "react";
import { Bar } from "react-chartjs-2";
import Papa from "papaparse";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ csvFile, isDashboard = false }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Member Count",
        data: [],
        backgroundColor: "rgba(67, 229, 244, 1)",
        borderColor: "rgba(67, 229, 244, 1)",
        borderWidth: 1,
      },
    ],
  });

  const [timeFrame, setTimeFrame] = useState("daily"); // Default time frame
  const [rawData, setRawData] = useState([]); // Store raw CSV data

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(csvFile);
      const text = await response.text();

      Papa.parse(text, {
        header: true,
        complete: (results) => {
          if (results.data.length > 0) {
            setRawData(results.data);
            processCSVData(results.data);
          }
        },
        error: (error) => {
          console.error("Error parsing CSV data:", error);
        },
      });
    } catch (error) {
      console.error("Error fetching CSV file:", error);
    }
  }, [csvFile]);

  const processCSVData = (data) => {
    const aggregatedData = {};
    data.forEach(row => {
      const date = new Date(row.date_only);
      let key;

      // Determine the key based on the selected time frame
      if (timeFrame === "weekly") {
        const weekNumber = Math.ceil((date.getDate() + date.getDay()) / 7);
        key = `${date.getFullYear()}-W${weekNumber}`;
      } else if (timeFrame === "monthly") {
        key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      } else if (timeFrame === "yearly") {
        key = `${date.getFullYear()}`;
      } else { // daily
        key = row.date_only;
      }

      // Aggregate member counts
      aggregatedData[key] = (aggregatedData[key] || 0) + parseInt(row.member_count, 10) || 0;
    });

    // Prepare chart data
    const labels = Object.keys(aggregatedData).sort((a, b) => new Date(a) - new Date(b));
    const values = labels.map(label => aggregatedData[label]);

    setChartData({
      labels,
      datasets: [
        {
          label: "Member Count",
          data: values,
          backgroundColor: isDarkMode ? "rgba(67, 229, 244, 1)" : "rgba(75, 192, 192, 1)",
          borderColor: isDarkMode ? "rgba(67, 229, 244, 1)" : "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    });
  };

  useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(matchMedia.matches);
    const handleChange = (e) => setIsDarkMode(e.matches);
    matchMedia.addEventListener("change", handleChange);

    fetchData(); // Fetch data on mount

    return () => {
      matchMedia.removeEventListener("change", handleChange);
    };
  }, [fetchData]);

  useEffect(() => {
    if (rawData.length > 0) {
      processCSVData(rawData); // Reprocess data whenever time frame changes
    }
  }, [timeFrame, rawData]);

  const handleTimeFrameChange = (frame) => {
    setTimeFrame(frame); // Update time frame
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
       <button onClick={() => handleTimeFrameChange("daily")}>Daily</button>
        <button onClick={() => handleTimeFrameChange("weekly")}>Weekly</button>
        <button onClick={() => handleTimeFrameChange("monthly")}>Monthly</button>
        <button onClick={() => handleTimeFrameChange("yearly")}>Yearly</button>
      </div>
      <div style={{ height: "470px" }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: !isDashboard,
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => {
                    return `Member Count: ${tooltipItem.raw}`;
                  },
                },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: timeFrame === "weekly" ? "Week" : timeFrame === "monthly" ? "Month" : timeFrame === "yearly" ? "Year" : "Date",
                },
                grid: {
                  display: false,
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Member Count",
                },
                beginAtZero: true,
                grid: {
                  color: isDarkMode ? 'rgba(220, 220, 220, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
              },
            },
            elements: {
              bar: {
                borderRadius: 10,
                backgroundColor: isDarkMode ? "rgba(67, 229, 244, 0.5)" : "rgba(75, 192, 192, 0.5)",
                hoverBackgroundColor: isDarkMode ? "rgba(67, 229, 244, 0.7)" : "rgba(75, 192, 192, 0.7)",
              },
            },
          }}
        />
      </div>

      <style jsx>{`
        button {
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          background-color: ${isDarkMode ? "#444" : "#ddd"};
          color: ${isDarkMode ? "#fff" : "#000"};
          cursor: pointer;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: ${isDarkMode ? "#555" : "#ccc"};
        }
        .chartjs-render-monitor {
          transition: transform 0.3s ease;
        }
        .chartjs-render-monitor:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default BarChart;
