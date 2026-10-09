'use client';

import React from 'react';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { VisualizationConfig } from '@/lib/types';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface DynamicVisualizationsProps {
  visualizations: VisualizationConfig[];
}

const palette = [
  'rgba(59,130,246,0.8)',
  'rgba(168,85,247,0.8)',
  'rgba(16,185,129,0.8)',
  'rgba(245,158,11,0.8)',
  'rgba(239,68,68,0.8)',
  'rgba(20,184,166,0.8)',
];

function getChartData(viz: VisualizationConfig) {
  return {
    labels: viz.labels,
    datasets: [
      {
        label: viz.title,
        data: viz.values,
        backgroundColor: viz.labels.map((_, i) => palette[i % palette.length]),
        borderColor: 'rgba(255,255,255,0.2)',
        borderWidth: 1,
      },
    ],
  };
}

export default function DynamicVisualizations({ visualizations }: DynamicVisualizationsProps) {
  if (!visualizations?.length) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-blue-400">Data Visualizations</h2>
      {visualizations.map((viz) => {
        const data = getChartData(viz);

        return (
          <div key={`${viz.title}-${viz.type}`} className="rounded-2xl border border-white/10 bg-gray-900/40 p-4">
            <h3 className="text-white text-base font-semibold mb-4">{viz.title}</h3>
            <div className="bg-black/30 rounded-xl p-3">
              {viz.type === 'pie' && <Pie data={data} />}
              {viz.type === 'bar' && <Bar data={data} />}
              {viz.type === 'line' && <Line data={data} />}
            </div>
          </div>
        );
      })}
    </section>
  );
}
