'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DemographicsChart = () => {
  const data = {
    labels: ['Males', 'Females'],
    datasets: [
      {
        label: 'Population',
        data: [3095, 3491],
        backgroundColor: ['#3b82f6', '#ec4899'],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000',
        bodyColor: '#000',
        bodyFont: {
          size: 14
        },
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          color: '#fff',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">Population Demographics</h3>
        <div className="text-lg">
          <span className="mr-4">Males: 3,095</span>
          <span>Females: 3,491</span>
        </div>
      </div>
      <div style={{ width: '100%', height: '300px', position: 'relative' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default DemographicsChart; 