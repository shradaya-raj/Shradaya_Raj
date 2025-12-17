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

const InternetAccessChart = () => {
  const data = {
    labels: ['Have Internet Access', 'No Internet Access'],
    datasets: [
      {
        label: 'Number of Households',
        data: [1315, 101],
        backgroundColor: ['#6366f1', '#a5b4fc'],
        borderColor: ['#4338ca', '#6366f1'],
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

export default InternetAccessChart; 