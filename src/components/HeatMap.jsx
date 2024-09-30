import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Papa from 'papaparse';

// List of months and days in each month
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const daysInMonth = {
  January: 31, February: 28, March: 31, April: 30, May: 31, June: 30,
  July: 31, August: 31, September: 30, October: 31, November: 30, December: 31
};

// Get the current month and year
const currentDate = new Date();
const currentMonth = months[currentDate.getMonth()];
const currentYear = currentDate.getFullYear();

const HeatMap = ({ csvFile, theme }) => {
  const [tooltip, setTooltip] = useState({ visible: false, content: '', top: 0, left: 0 });
  const [selectedDay, setSelectedDay] = useState(null);
  const [hourlyCounts, setHourlyCounts] = useState({});
  const [dailyCounts, setDailyCounts] = useState({});
  const [showHourly, setShowHourly] = useState(false);

  useEffect(() => {
    const fetchCSVData = async () => {
      try {
        const response = await fetch(csvFile);
        const text = await response.text();

        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const data = results.data.filter(row => {
              if (row.date && row.messages) {
                const date = new Date(row.date);
                return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentYear;
              }
              return false;
            });

            const { dailyCounts, hourlyCounts } = countOccurrences(data);
            setDailyCounts(dailyCounts);
            setHourlyCounts(hourlyCounts);
          },
          error: (error) => {
            console.error("Error parsing CSV file:", error);
          }
        });
      } catch (error) {
        console.error("Error fetching CSV file:", error);
      }
    };

    fetchCSVData();
  }, [csvFile]);

  const countOccurrences = (data) => {
    const dailyCounts = {};
    const hourlyCounts = {};

    data.forEach(entry => {
      const date = new Date(entry.date);
      const day = date.getDate();

      // Initialize daily counts for the current month
      if (!dailyCounts[currentMonth]) {
        dailyCounts[currentMonth] = Array(daysInMonth[currentMonth]).fill(0);
      }
      dailyCounts[currentMonth][day - 1] += entry.messages;

      // Generate hourly counts
      const hourKey = `${currentMonth} ${day} ${date.getHours()}`;
      if (!hourlyCounts[hourKey]) {
        hourlyCounts[hourKey] = 0;
      }
      hourlyCounts[hourKey] += entry.messages;
    });

    return { dailyCounts, hourlyCounts };
  };

  const handleMouseEnter = (e, label, count) => {
    const container = document.querySelector('.heatmap-container');
    const containerRect = container.getBoundingClientRect();
    const rect = e.target.getBoundingClientRect();
    const tooltipWidth = 140;
    const tooltipHeight = 50;

    let tooltipTop = rect.top + window.scrollY - tooltipHeight - 10;
    let tooltipLeft = rect.left + window.scrollX + rect.width / 2 - tooltipWidth / 2;

    if (tooltipLeft < containerRect.left) {
      tooltipLeft = containerRect.left + 10;
    } else if (tooltipLeft + tooltipWidth > containerRect.right) {
      tooltipLeft = containerRect.right - tooltipWidth - 10;
    }

    setTooltip({
      visible: true,
      content: `${label}: ${count} message${count !== 1 ? 's' : ''} <br /> Click to view hourly data`,
      top: tooltipTop,
      left: tooltipLeft
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  const handleClick = (day) => {
    const key = `${currentMonth} ${day}`;
    setSelectedDay(key);
    setShowHourly(true);
  };

  const handleHourClick = () => {
    setShowHourly(false);
    setSelectedDay(null);
  };

  const renderDays = () => {
    const numberOfDays = daysInMonth[currentMonth];
    return Array.from({ length: numberOfDays }, (_, index) => {
      const day = index + 1;
      const count = dailyCounts[currentMonth] ? dailyCounts[currentMonth][day - 1] || 0 : 0;
      const color = getColor(count);

      return (
        <DaySquare
          key={day}
          style={{ backgroundColor: color }}
          onMouseEnter={(e) => handleMouseEnter(e, `Day ${day}`, count)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(day)}
        />
      );
    });
  };

  const getColor = (count) => {
    if (count === 0) return theme === 'dark' ? '#444' : '#ddd';
    if (count <= 20) return '#54d5d9';
    if (count <= 40) return '#2c9393';
    return '#176364';
  };

  const renderHourlyData = () => {
    if (!selectedDay) return null;

    const [month, day] = selectedDay.split(' ');
    const hourlySquares = [];

    for (let hour = 0; hour < 24; hour++) {
      const hourKey = `${month} ${day} ${hour}`;
      const count = hourlyCounts[hourKey] || 0;
      const color = getColor(count);
      const label = `Hour ${hour}`;

      hourlySquares.push(
        <HourSquare
          key={hour}
          style={{ backgroundColor: color }}
          onMouseEnter={(e) => handleMouseEnter(e, label, count)}
          onMouseLeave={handleMouseLeave}
          onClick={handleHourClick}
        />
      );
    }

    return (
      <HourlyDataContainer theme={theme}>
        <h4>Hourly Data for {selectedDay}</h4>
        <HoursGrid>
          {hourlySquares}
        </HoursGrid>
      </HourlyDataContainer>
    );
  };

  return (
    <HeatmapContainer className={`heatmap-container ${theme}`}>
      {showHourly ? (
        renderHourlyData()
      ) : (
        <MonthContainer>
          <MonthName theme={theme}>{currentMonth}</MonthName>
          <DaysGrid>
            {renderDays()}
          </DaysGrid>
        </MonthContainer>
      )}
      {tooltip.visible && (
        <Tooltip theme={theme} style={{ top: tooltip.top, left: tooltip.left }} dangerouslySetInnerHTML={{ __html: tooltip.content }} />
      )}
    </HeatmapContainer>
  );
};

// Styled components for HeatMap

const HeatmapContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  margin: 10px 0;
`;

const MonthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;

const MonthName = styled.div`
  margin-bottom: 10px;
  font-size: 1.5em;
  font-weight: bold;
  color: ${({ theme }) => (theme === 'dark' ? 'color.grey[200]' : 'color.grey[200]')};
  white-space: nowrap;
  text-align: center;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 5px;
  width: 100%;
  height: auto;
`;

const DaySquare = styled.div`
  width: 100%;
  padding-top: 100%;
  position: relative;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;

  &:hover {
    opacity: 0.9;
    transform: scale(1.1);
    cursor: pointer;
  }
`;

const HourlyDataContainer = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: transparent; /* Transparent background */
`;

const HoursGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 5px;
  width: 100%;
  height: auto;
`;

const HourSquare = styled.div`
  width: 100%;
  padding-top: 100%;
  position: relative;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;

  &:hover {
    opacity: 0.9;
    transform: scale(1.1);
    cursor: pointer;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  padding: 10px;
  background-color: ${({ theme }) => (theme === 'dark' ? '#333' : '#fff')};
  border: 1px solid ${({ theme }) => (theme === 'dark' ? '#ADD8E6' : '#000080')};
  border-radius: 5px;
  color: ${({ theme }) => (theme === 'dark' ? '#fff' : '#000')};
  font-size: 0.9em;
  pointer-events: none;
  z-index: 1000;
  white-space: nowrap;
  opacity: 0.9;
`;

export default HeatMap;
