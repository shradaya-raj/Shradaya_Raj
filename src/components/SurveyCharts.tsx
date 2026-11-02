import type { VisualizationConfig } from '@/lib/types'

// Small SVG/CSS charts keep survey results available in the initial HTML.
// Exact values remain readable without JavaScript, hover or colour perception.
export default function SurveyCharts({ visualizations }: { visualizations: VisualizationConfig[] }) {
  return <section aria-label="Survey charts" className="webgis-charts grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-3">
    {visualizations.map(viz => {
      const total = viz.values.reduce((sum, value) => sum + value, 0)
      const maximum = Math.max(...viz.values, 1)
      let previous = 0
      const slices = viz.values.map((value, index) => {
        const start = previous
        previous += total ? value / total * 100 : 0
        return `var(--survey-color-${index % 4}) ${start.toFixed(4)}% ${previous.toFixed(4)}%`
      })
      return <article key={viz.title} className="webgis-chart-card min-w-0 rounded-2xl p-4 sm:p-6 flex flex-col">
        <p className="webgis-chart-eyebrow text-xs uppercase tracking-widest mb-3">Field survey</p>
        <h3 className="webgis-chart-title text-lg font-semibold leading-snug min-h-[3.5rem]">{viz.title}</h3>
        <div className="relative min-w-0 w-full h-[230px] my-5 flex items-center justify-center">
          {viz.type === 'pie' ? <div role="img" aria-label={viz.title} className="survey-donut relative w-[200px] max-w-full aspect-square rounded-full" style={{ background: total ? `conic-gradient(${slices.join(',')})` : 'var(--survey-color-0)' }}>
            <div className="survey-donut-centre absolute inset-[12%] rounded-full flex flex-col items-center justify-center"><span className="webgis-chart-total text-3xl font-semibold">{total.toLocaleString('en-US')}</span><span className="webgis-chart-eyebrow text-xs mt-1">Total surveyed</span></div>
          </div> : <svg viewBox="0 0 260 230" className="w-full h-full" role="img" aria-label={viz.title}>
            {[0, 0.5, 1].map(fraction => <g key={fraction}><line x1="40" x2="255" y1={190 - fraction * 170} y2={190 - fraction * 170} stroke="currentColor" opacity=".15" /><text x="34" y={194 - fraction * 170} textAnchor="end" fill="currentColor" fontSize="11">{Math.round(maximum * fraction).toLocaleString('en-US')}</text></g>)}
            {viz.values.map((value, index) => {
              const slot = 210 / Math.max(viz.values.length, 1)
              const height = value / maximum * 170
              return <g key={viz.labels[index]}><title>{viz.labels[index]}: {value.toLocaleString('en-US')}</title><rect x={44 + slot * index} y={190 - height} width={slot * .7} height={height} rx="5" fill={`var(--survey-color-${index % 4})`} /><text x={44 + slot * (index + .35)} y="213" textAnchor="middle" fill="currentColor" fontSize="11">{String(index + 1).padStart(2, '0')}</text></g>
            })}
          </svg>}
        </div>
        <ul className="space-y-3 mt-auto" aria-label={`${viz.title}: exact values`}>{viz.labels.map((label, index) => <li key={label} className="webgis-chart-row flex gap-2 items-start text-sm pt-3"><span aria-hidden="true" className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: `var(--survey-color-${index % 4})` }} /><span className="min-w-0 flex-1">{viz.type === 'bar' ? `${String(index + 1).padStart(2, '0')} · ` : ''}{label}</span><span className="shrink-0 text-right font-semibold tabular-nums">{viz.values[index].toLocaleString('en-US')}<span className="webgis-chart-eyebrow block text-xs font-normal">{total ? (viz.values[index] / total * 100).toFixed(1) : '0'}%</span></span></li>)}</ul>
      </article>
    })}
  </section>
}
