import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { csv } from 'd3-fetch';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StackedBarChart = ({ csvFile }) => {
    const themeColors = [
        "#45e8ed","#0b4a4c", "#3fb3b5", "#69edf1", "#8df2f5", "#b0f7f8", "#d4fbfc", "#54d5d9", "#3fb3b5", "#2c9393",
        "#2db7ba", "#229ca1", "#1c8084", "#176364", "#11494c", "#0d3738", "#091f21", "#0b4a4c"
    ];

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        const parseCSV = async () => {
            try {
                const data = await csv(csvFile);
                const labels = data.map(d => d.date_only);
                const replies = data.map(d => +d.replies);
                const views = data.map(d => +d.views);
                const forwards = data.map(d => +d.forwards);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Replies',
                            data: replies,
                            backgroundColor: themeColors[0], // Assign color for 'Replies'
                        },
                        {
                            label: 'Views',
                            data: views,
                            backgroundColor: themeColors[1], // Assign color for 'Views'
                        },
                        {
                            label: 'Forwards',
                            data: forwards,
                            backgroundColor: themeColors[2], // Assign color for 'Forwards'
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching or parsing CSV file:', error);
            }
        };

        parseCSV();
    }, [csvFile]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true, // Enable stacking on the x-axis
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                stacked: true, // Enable stacking on the y-axis
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Count',
                },
            },
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Stacked Bar Chart',
            },
        },
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default StackedBarChart;
