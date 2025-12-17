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

const WallTypesChart = () => {
  const data = {
    labels: ['Brick', 'Block', 'Stone', 'Mud', 'Metal Sheet'],
    datasets: [
      {
        label: 'Number of Households',
        data: [846, 341, 127, 97, 5],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(74, 222, 128, 0.8)',
          'rgba(134, 239, 172, 0.8)',
          'rgba(187, 247, 208, 0.8)',
          'rgba(220, 252, 231, 0.8)',
        ],
        borderColor: [
          'rgb(21, 128, 61)',
          'rgb(34, 197, 94)',
          'rgb(74, 222, 128)',
          'rgb(134, 239, 172)',
          'rgb(187, 247, 208)',
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

export default WallTypesChart; 