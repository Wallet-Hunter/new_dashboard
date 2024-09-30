import React, { useEffect, useState } from 'react';
import GaugeChart from 'react-gauge-chart';

const SentimentMeter = () => {
  const [sentimentValue, setSentimentValue] = useState(0.5); // Initial value at 50%
  const [theme, setTheme] = useState("light");

  const getSentimentLabel = (value) => {
    const sentimentDescriptions = [
      { label: 'Bored', min: 0, max: 0.17 },
      { label: 'Surprised', min: 0.17, max: 0.33 },
      { label: 'Worried', min: 0.33, max: 0.4 },
      { label: 'Neutral', min: 0.5, max: 0.67 },
      { label: 'Calm', min: 0.67, max: 0.83 },
      { label: 'Good', min: 0.83, max: 0.92 },
      { label: 'Happiness', min: 0.92, max: 1 }
    ];
    const sentiment = sentimentDescriptions.find(sent => value >= sent.min && value <= sent.max);
    return sentiment ? sentiment.label : '';
  };

  // Theme handling for dark/light mode
  useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(matchMedia.matches ? "dark" : "light");

    const handleThemeChange = (e) => {
      setTheme(e.matches ? "dark" : "light");
    };

    matchMedia.addEventListener("change", handleThemeChange);
    return () => {
      matchMedia.removeEventListener("change", handleThemeChange);
    };
  }, []);

  const styles = {
    body: {
      margin: 0,
      padding: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '40vh', // Increased height
    },
    sentimentContainer: {
      width: '100%', // Full width of parent
      maxWidth: '700px', // Increased max width for larger meter
      textAlign: 'center',
      position: 'relative',
      padding: '10px',
      boxSizing: 'border-box',
    },
    gaugeContainer: {
      width: '100%',
      maxHeight: '250px', // Increased height for the gauge
    },
    sentimentLabel: {
      marginTop: '20px',
      fontSize: '18px', // Slightly larger font size for label
      fontWeight: 'bold',
      color: '#4bc3db',
    },
    title: {
      fontSize: '24px', // Title font size
      fontWeight: 'bold',
      color: 'color.grey[200]',
      marginBottom: '10px', // Space below the title
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.sentimentContainer}>
        <h2 style={styles.title}>Sentiment Meter</h2> {/* Added Title */}
        <div style={styles.gaugeContainer}>
          <GaugeChart
            id="sentiment-gauge"
            nrOfLevels={6}
            percent={sentimentValue}
            colors={['#c2ebf3', '#86d7e7', '#4bc3db', '#1c6a7a', '#144f5b', '#0d333a']}
            arcWidth={0.3}
            needleColor="#464A4F"
            textColor="#4bc3db"
            animate={true}
            style={{ width: '100%', height: '100%' }} // Increased size of the gauge
          />
        </div>
        <div style={styles.sentimentLabel}>
          <p>{getSentimentLabel(sentimentValue)}</p>
        </div>
      </div>
    </div>
  );
};

export default SentimentMeter;
