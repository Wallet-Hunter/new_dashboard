import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import Papa from "papaparse";

// Register the required Chart.js components (Title, Tooltip, Legend, etc.)
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
);

const ComboChart = ({ csvFile }) => {
  const [data, setData] = useState(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    Papa.parse(csvFile, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        const labels = result.data.map((row) => row.label);
        const barData = result.data.map((row) => row.barValue);
        const lineData = result.data.map((row) => row.lineValue);

        setData({
          labels: labels,
          datasets: [
            {
              label: "Bar Data",
              data: barData,
              backgroundColor: "#43e5f4",
              hoverBackgroundColor: "#aaf0f2",
              type: "bar",
              borderRadius: 10,
              barThickness: 20,
              borderSkipped: false,
            },
            {
              label: "Line Data",
              data: lineData,
              borderColor: theme === "light" ? "#43e5f4" : "#43e5f4",
              backgroundColor: "rgba(52, 152, 219, 0.2)",
              tension: 0.1,
              type: "line",
              pointRadius: 5,
              pointBackgroundColor: theme === "light" ? "#055457" : "#1e90ff",
              pointBorderColor: "#ffffff",
              pointHoverBackgroundColor: "#ffffff",
              pointHoverBorderColor: theme === "light" ? "#2980b9" : "#1e90ff",
            },
          ],
        });
      },
    });

    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(matchMedia.matches ? "dark" : "light");

    const handleThemeChange = (e) => {
      setTheme(e.matches ? "dark" : "light");
    };

    matchMedia.addEventListener("change", handleThemeChange);

    return () => {
      matchMedia.removeEventListener("change", handleThemeChange);
    };
  }, [csvFile]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        backgroundColor: theme === "light" ? "#ffffff" : "#1e1e1e",
        borderColor: theme === "light" ? "#cccccc" : "#333333",
        borderWidth: 1,
        titleColor: theme === "light" ? "#333333" : "#ffffff",
        bodyColor: theme === "light" ? "#333333" : "#ffffff",
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)",
          borderColor: theme === "light" ? "#cccccc" : "#444444",
          borderWidth: 1,
        },
        ticks: {
          color: theme === "light" ? "#333333" : "#bbbbbb",
        },
      },
      y: {
        grid: {
          color: theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)",
          borderColor: theme === "light" ? "#cccccc" : "#444444",
          borderWidth: 1,
        },
        ticks: {
          color: theme === "light" ? "#333333" : "#bbbbbb",
        },
      },
    },
  };

  return (
    <div style={styles.chartContainer(theme)}>
      {data && <Line data={data} options={chartOptions} />}
    </div>
  );
};

const styles = {
  chartContainer: (theme) => ({
    padding: "20px",
    borderRadius: "15px",
    maxWidth: "700px",
    margin: "auto",
    marginRight: "0",
    marginLeft: "auto",
    backgroundColor: theme === "light" ? "#f9f9f9" : "#1e1e1e",
    boxShadow: theme === "light" ? "0 6px 20px rgba(0, 0, 0, 0.2)" : "0 6px 20px rgba(0, 0, 0, 0.5)",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  }),
};

export default ComboChart;
