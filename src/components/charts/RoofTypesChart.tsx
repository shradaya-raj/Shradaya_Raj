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

const RoofTypesChart = () => {
  const data = {
    labels: ['Concrete', 'Metal Sheet', 'Stone', 'Khayer/Hay'],
    datasets: [
      {
        label: 'Number of Households',
        data: [1038, 266, 53, 59],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(96, 165, 250, 0.8)',
          'rgba(147, 197, 253, 0.8)',
          'rgba(191, 219, 254, 0.8)',
        ],
        borderColor: [
          'rgb(30, 64, 175)',
          'rgb(59, 130, 246)',
          'rgb(96, 165, 250)',
          'rgb(147, 197, 253)',
        ],
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
        display: false,
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
            size: 12,
            weight: 'bold'
          }
        }
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '300px', position: 'relative' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default RoofTypesChart; 