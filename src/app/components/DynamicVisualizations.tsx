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
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import { VisualizationConfig } from '@/lib/types';
import { usePortfolioTheme } from '@/components/PortfolioTheme';

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
  compact?: boolean;
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

export default function DynamicVisualizations({ visualizations, compact = false }: DynamicVisualizationsProps) {
  const { theme } = usePortfolioTheme();
  const dark = theme === 'dark';
  const colors = dark ? ['#73cec1', '#789bc8', '#d2b174', '#9f91b8'] : ['#277c70', '#587eac', '#b28b40', '#82749e'];
  const ink = dark ? '#c6d5e2' : '#42594f';
  const grid = dark ? 'rgba(173,199,215,0.12)' : 'rgba(49,79,65,0.1)';
  if (!visualizations?.length) return null;

  if (compact) return <section aria-label="Interactive survey charts" className="webgis-charts grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-3">
    {visualizations.map((viz) => {
      const total = viz.values.reduce((sum, value) => sum + value, 0);
      // Neutral population categories; teal/access and amber/access gap.
      const chartColors = viz.labels.some((label) => /internet/i.test(label))
        ? (dark ? ['#73cec1', '#dbb67a'] : ['#277c70', '#96651d'])
        : viz.labels.some((label) => /^(male|female)$/i.test(label))
          ? (dark ? ['#89afe0', '#dbb67a'] : ['#426f9e', '#96651d'])
          : colors;
      const data = {
        labels: viz.labels,
        datasets: [{ label: viz.title, data: viz.values, backgroundColor: viz.labels.map((_, index) => chartColors[index % chartColors.length]), borderWidth: viz.type === 'pie' ? 2 : 0, borderColor: dark ? '#192d3d' : '#f5f9f6', borderRadius: viz.type === 'bar' ? 6 : 0, hoverOffset: 5 }],
      };
      const options = {
        responsive: true, maintainAspectRatio: false, resizeDelay: 100,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#12283a', titleColor: '#ffffff', bodyColor: '#e4eef3', padding: 12, cornerRadius: 8, displayColors: true },
        },
      };
      return <article key={viz.title} className="webgis-chart-card min-w-0 rounded-2xl p-4 sm:p-6 flex flex-col">
        <p className="webgis-chart-eyebrow text-xs uppercase tracking-widest mb-3">Field survey</p>
        <h3 className="webgis-chart-title text-lg font-semibold leading-snug min-h-[3.5rem]">{viz.title}</h3>
        <div className="relative min-w-0 w-full h-[230px] my-5">
          {viz.type === 'pie' && <><Doughnut data={data} options={{ ...options, cutout: '76%' }} aria-label={viz.title} role="img" /><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="webgis-chart-total text-3xl font-semibold tracking-tight">{total.toLocaleString('en-US')}</span><span className="webgis-chart-eyebrow text-xs mt-1">Total surveyed</span></div></>}
          {viz.type === 'bar' && <Bar data={data} options={{ ...options, scales: { x: { grid: { display: false }, border: { display: false }, ticks: { color: ink, font: { size: 11 }, callback: (_value, index) => `0${index + 1}` } }, y: { beginAtZero: true, border: { display: false }, grid: { color: grid }, ticks: { color: ink, maxTicksLimit: 5, precision: 0 } } } }} aria-label={viz.title} role="img" />}
          {viz.type === 'line' && <Line data={data} options={options} aria-label={viz.title} role="img" />}
        </div>
        <ul className="space-y-3 mt-auto" aria-label={`${viz.title}: exact values`}>{viz.labels.map((label, index) => <li key={label} className="webgis-chart-row flex gap-2 items-start text-sm pt-3"><span aria-hidden="true" className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: chartColors[index % chartColors.length] }} /><span className="flex-1">{viz.type === 'bar' ? `0${index + 1} · ` : ''}{label}</span><span className="text-right font-semibold tabular-nums">{viz.values[index].toLocaleString('en-US')}<span className="webgis-chart-eyebrow block text-xs font-normal">{total ? (viz.values[index] / total * 100).toFixed(1) : '0'}%</span></span></li>)}</ul>
      </article>;
    })}
  </section>;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-blue-400">Data Visualizations</h2>
      <div className={compact ? 'grid gap-6 lg:grid-cols-3' : 'space-y-6'}>{visualizations.map((viz) => {
        const data = getChartData(viz);

        return (
          <div key={`${viz.title}-${viz.type}`} className="rounded-2xl border border-white/10 bg-gray-900/40 p-4">
            <h3 className="text-white text-base font-semibold mb-4">{viz.title}</h3>
            <div className={`bg-black/30 rounded-xl p-3 ${compact ? 'h-[280px]' : ''}`}>
              {viz.type === 'pie' && <Pie data={data} options={compact ? { maintainAspectRatio: false } : undefined} />}
              {viz.type === 'bar' && <Bar data={data} options={compact ? { maintainAspectRatio: false } : undefined} />}
              {viz.type === 'line' && <Line data={data} options={compact ? { maintainAspectRatio: false } : undefined} />}
            </div>
          </div>
        );
      })}</div>
    </section>
  );
}
