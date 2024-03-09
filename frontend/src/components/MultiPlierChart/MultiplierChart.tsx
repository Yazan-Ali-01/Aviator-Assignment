import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import type { ChartData, ChartOptions } from 'chart.js';
import { Chart } from 'chart.js'
import 'chartjs-adapter-moment';
import './chart.css';
import { useWebSocket } from '../../contexts/WebSocketContext';


interface LineProps {
  options: ChartOptions<'line'>;
  data: ChartData<'line'>;
}

const MyLineChart: React.FC<LineProps> = ({ options, data }) => {
  return <Line options={options} data={data} />;
};
// const initialChartData = () => {
//   const data = [];
//   // Create the flat part
//   for (let x = 0; x <= 3; x += 0.1) { // Adjust the step for more or fewer points
//     data.push({ x, y: 0 });
//   }

//   // Add the curved part (example with a simple quadratic curve for demonstration)
//   for (let x = 3.1; x <= 10; x += 0.1) {
//     const y = (x - 3) ** 2; // Simple quadratic curve for demonstration, adjust as needed
//     data.push({ x, y });
//   }

//   return data;
// };

const multiplierRef = { value: 0 };


const MultiplierChart = () => {
  const { isRoundActive, multiplierUpdates, multiplier } = useWebSocket();
  useEffect(() => {
    multiplierRef.value = multiplier;
  }, [multiplier]);


  const [roundKey, setRoundKey] = useState(0);

  useEffect(() => {
    Chart.register({
      id: 'textOverlay',
      beforeDraw: (chart) => {
        const ctx = chart.ctx;
        const { width, height } = chart.chartArea;
        const x = width / 2;
        const y = height / 2;

        ctx.save();
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#84cc16'; // Customize your text color
        ctx.fillText(`${multiplierRef.value.toFixed(2).toString()} X`, x, y);
        ctx.restore();
      }
    });


  }, [multiplier])


  // Initial chart state setup
  const [chartData, setChartData] = useState({
    datasets: [{
      label: 'Multiplier',
      data: [],
      borderColor: 'rgb(242, 85, 81)',
      tension: 0.1,
      fill: false,
      pointBackgroundColor: [],
      pointRadius: []
    }],
  });

  useEffect(() => {
    if (isRoundActive) {
      // Reset chartData only when a new round is detected
      setChartData({
        datasets: [{
          label: 'Multiplier',
          data: [],
          borderColor: 'rgb(242, 85, 81)',
          tension: 0.1,
          fill: false,
          pointBackgroundColor: [],
          pointRadius: []
        }],
      });
    } else {
      // When round is not active, prepare for a new round
      setRoundKey(prevKey => prevKey + 1); // Increment key to force re-render
    }
  }, [isRoundActive]);

  const options: ChartOptions<'line'> = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        min: 0,
        max: 10,
        title: {
          display: true,
          text: 'Multiplier', // Keep this as is for a standard approach
        },
        ticks: {
          stepSize: 1,
        },
        grid: {
          display: false, // Add this line to hide the x-axis grid lines
        },
      },
      y: {
        display: true, // Set this to true to enable y-axis display
        min: 0,
        max: 10,
        title: {
          display: false, // Set this to false to hide the title
          text: '', // Can be empty since it's hidden
        },
        ticks: {
          display: false, // Hide the tick labels
        },
        grid: {
          display: false, // Add this line to hide the x-axis grid lines
        },
      },
    },
    animation: {
      duration: 0,
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  useEffect(() => {
    if (isRoundActive) {
      const modifiedData = multiplierUpdates.map(update => {
        const y = (update.elapsed * update.elapsed) * 0.1;
        return { x: update.elapsed, y: y };
      });

      // Check if modifiedData is not empty and then customize the last point
      if (modifiedData.length > 0) {
        // Example customization: Increase the radius of the last point
        const pointRadius = new Array(modifiedData.length).fill(3); // Default radius for all points
        pointRadius[modifiedData.length - 1] = 8; // Larger radius for the last point

        // Example customization: Change background color of the last point
        const pointBackgroundColor = new Array(modifiedData.length).fill('rgb(242, 85, 81)'); // Default color for all points
        pointBackgroundColor[modifiedData.length - 1] = 'rgb(253, 182, 34)'; // Different color for the last point

        setChartData({
          datasets: [{
            label: 'Multiplier',
            data: modifiedData,
            borderColor: 'rgb(242, 85, 81)',
            tension: 0.1,
            fill: false,
            pointRadius: pointRadius, // Apply custom radius
            pointBackgroundColor: pointBackgroundColor, // Apply custom background color
          }],
        });
      }
    }
  }, [multiplierUpdates, isRoundActive]);



  return (
    <div style={{ position: 'relative', height: '70vh', width: '100%' }}>
      <MyLineChart data={chartData} options={options} />
    </div>
  );
};

export default MultiplierChart;
