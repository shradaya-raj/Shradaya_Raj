'use client'

import { useEffect, useRef } from 'react'

// SVG attributes must serialize identically across server/browser math runtimes.
const svgValue = (value: number) => value.toFixed(4)

// A stylized mountain valley, not measurements from a real survey.
const terrain = Array.from({ length: 9 }, (_, row) => Array.from({ length: 9 }, (_, column) => {
  const taper = Math.sin(Math.PI * column / 8) * Math.sin(Math.PI * row / 8)
  const elevation = taper * (76 * Math.exp(-((column - 3) ** 2 + (row - 4) ** 2) / 4) + 54 * Math.exp(-((column - 6) ** 2 + (row - 3) ** 2) / 3))
  return { x: 150 + (column - row) * 14, y: 87 + (column + row) * 7 - elevation, elevation }
}))
const terrainFaces = terrain.slice(0, -1).flatMap((row, r) => row.slice(0, -1).flatMap((p, c) => {
  const right = terrain[r][c + 1], down = terrain[r + 1][c], diagonal = terrain[r + 1][c + 1]
  return [[p, right, diagonal], [p, diagonal, down]].map(points => ({
    points: points.map(point => `${svgValue(point.x)},${svgValue(point.y)}`).join(' '),
    shade: .04 + points.reduce((sum, point) => sum + point.elevation, 0) / 500,
  }))
}))
// A synthetic point sample of ground and a small structure, never project scan data.
const projectCloudPoint = (x: number, y: number, z: number, kind: string) => ({
  x: 112 + (x - y) * 7.5, y: 26 + (x + y) * 4.5 - z, kind,
})
const scanCloud = [
  ...Array.from({ length: 144 }, (_, i) => {
    const x = i % 12, y = Math.floor(i / 12)
    return projectCloudPoint(x, y, 8 * Math.sin(x * .35) * Math.sin(y * .3), 'ground')
  }),
  ...Array.from({ length: 49 }, (_, i) => projectCloudPoint(7 + (i % 7) * .65, 2 + Math.floor(i / 7) * .65, 31, 'roof')),
  ...Array.from({ length: 35 }, (_, i) => projectCloudPoint(7 + (i % 7) * .65, 5.9, 5 + Math.floor(i / 7) * 6.5, 'wall')),
  ...Array.from({ length: 35 }, (_, i) => projectCloudPoint(10.9, 2 + (i % 7) * .65, 5 + Math.floor(i / 7) * 6.5, 'wall')),
]
export default function CinematicBackdrop() {
  const scene = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = scene.current
    if (!element) return
    let visible = true
    const update = () => { element.dataset.running = String(visible && !document.hidden) }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() })
    observer.observe(element)
    document.addEventListener('visibilitychange', update)
    update()
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [])

  return (
    <div ref={scene} className="cinematic-scene" data-running="false">
      <div aria-hidden="true" className="survey-art">
        <div className="survey-orb survey-orb-one" />
        <div className="survey-orb survey-orb-two" />
        <svg className="survey-contours" viewBox="0 0 700 700" fill="none">
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d="M-60 330C40 130 150 490 270 300S480 80 530 260 690 520 780 280" stroke="currentColor" strokeWidth="1" transform={`translate(0 ${i * 26 - 100})`} />
          ))}
        </svg>
        <div className="mapping-flight">
          <span className="mapping-caption">UAV / FLIGHT PLAN</span>
          <div className="flight-graphic">
          <svg viewBox="0 0 280 230" fill="none" className="mapping-flight-map">
            <path d="M30 45H240V190H30Z" stroke="currentColor" opacity=".25" />
            <path d="M50 65H220V100H50V135H220V170H50" stroke="currentColor" strokeDasharray="4 6" />
            {[[30,45],[240,45],[30,190],[240,190]].map(([x,y]) => <g key={`${x}-${y}`}><circle cx={x} cy={y} r="4" stroke="currentColor" /><path d={`M${x-8} ${y}h16M${x} ${y-8}v16`} stroke="currentColor" opacity=".5" /></g>)}
          </svg>
          <svg className="mapping-drone" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="m12 12 16 16m0-16L12 28" /><rect x="16" y="13" width="8" height="14" rx="3" fill="currentColor" />
            {[[10,10],[30,10],[10,30],[30,30]].map(([x,y]) => <g key={`${x}-${y}`}><circle cx={x} cy={y} r="7" /><path d={`M${x-4} ${y}h8`} strokeWidth="2" /></g>)}
          </svg>
          </div>
        </div>
        <div className="terrain-model">
          <span className="mapping-caption">3D / TERRAIN RECONSTRUCTION</span>
          <svg className="terrain-wireframe reconstruction-model mountain-reconstruction" viewBox="0 0 300 230" fill="none" stroke="currentColor" strokeWidth=".65" strokeLinejoin="round">
            <path d="m38 143 112 56 112-56v18l-112 56-112-56Z" className="mountain-strata" />
            <path d="m38 149 112 56 112-56m-224 6 112 56 112-56M150 199v18" strokeOpacity=".35" />
            <g className="mountain-surface">
              {terrainFaces.map((face, i) => <polygon key={i} points={face.points} fill="currentColor" fillOpacity={svgValue(face.shade)} strokeOpacity=".48" />)}
            </g>
            <polyline points={terrain[4].map(p => `${svgValue(p.x)},${svgValue(p.y)}`).join(' ')} strokeWidth="1.25" strokeOpacity=".85" />
            <path d="m70 155 25 1 20 14 17 2 21 15 30-6 20-15 19-3" strokeWidth="1.5" strokeOpacity=".75" />
            <g className="reconstruction-scan">
              <path d="m38 94 112-56 112 56-112 56Z" fill="currentColor" fillOpacity=".035" strokeDasharray="3 4" strokeOpacity=".35" />
              <path d="m38 94 112 56 112-56" strokeWidth="1.2" strokeOpacity=".7" />
            </g>
            <g strokeOpacity=".6"><path d="M38 134v17m-8-8h16M262 134v17m-8-8h16M150 191v17m-8-8h16" /></g>
            <g className="reconstruction-node" fill="currentColor" stroke="none">
              {[terrain[4][3], terrain[3][6]].map((p, i) => <circle key={i} cx={svgValue(p.x)} cy={svgValue(p.y)} r="2" />)}
            </g>
          </svg>
        </div>
        <div className="survey-instrument">
          <span className="mapping-caption">SURVEY / CONTROL NETWORK</span>
          <svg viewBox="0 0 250 160" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="m40 140 20-80 20 80M60 60v80m-20-60h40M47 45h26v18H47Zm7-8h12v8M73 51h15" />
            <path className="survey-sightline" d="M88 51 220 35 180 125Z" strokeDasharray="3 5" opacity=".5" />
            <path d="M220 20v30m-15-15h30M180 110v30m-15-15h30" />
            <circle cx="220" cy="35" r="5" /><circle cx="180" cy="125" r="5" />
          </svg>
        </div>
        <div className="gnss-constellation">
          <span className="mapping-caption">GNSS / ORBITAL CONSTELLATION</span>
          <div className="constellation-system">
            {[0, 1, 2].map(plane => (
              <div key={plane} className={`constellation-plane constellation-plane-${plane}`}>
                <div className="constellation-track" />
                {[0, 1].map(satellite => (
                  <svg key={satellite} className={`constellation-satellite satellite-${satellite}`} viewBox="0 0 36 28" fill="none" stroke="currentColor" strokeWidth="1.1">
                    <path d="M13 9h10v10H13ZM2 7h9v14H2Zm23 0h9v14h-9ZM6 7v14M30 7v14M2 14h9m14 0h9M18 19v5m-4-2q4 5 8 0" />
                  </svg>
                ))}
              </div>
            ))}
            <svg className="constellation-globe" viewBox="0 0 260 230" fill="none" stroke="currentColor" strokeWidth=".8">
              <circle cx="130" cy="115" r="37" className="constellation-earth" />
              <ellipse cx="130" cy="115" rx="17" ry="37" />
              <ellipse cx="130" cy="115" rx="37" ry="13" />
              <path d="M93 115h74m-37-37v74m-30-58h60m-60 42h60" opacity=".5" />
              <path className="gnss-link" d="M53 80 130 115 204 78m-74 37-59 58m59-58 65 54" strokeDasharray="2 5" opacity=".5" />
              <circle cx="130" cy="115" r="3" fill="currentColor" />
              <path d="M124 165h12m-6-6v12" />
            </svg>
          </div>
        </div>
        <div className="lidar-cloud">
          <span className="mapping-caption">POINT CLOUD</span>
          <svg viewBox="0 0 230 180" fill="currentColor" className="lidar-points lidar-reconstruction">
            <path d="m22 82 90 54 90-54m-180 5 90 54 90-54" fill="none" stroke="currentColor" strokeWidth=".6" opacity=".25" />
            {scanCloud.map((point, i) => <circle key={i} className={`cloud-${point.kind}`} cx={svgValue(point.x)} cy={svgValue(point.y)} r={point.kind === 'roof' ? 1.15 : 1} opacity={svgValue(point.kind === 'ground' ? .35 + (i % 4) * .1 : .85)} />)}
            <g className="lidar-sweep" fill="none" stroke="currentColor">
              <path d="m22 40 90 48 90-48" strokeWidth="1.2" opacity=".7" />
              <path d="m22 40 90-45 90 45-90 48Z" fill="currentColor" fillOpacity=".035" strokeWidth=".5" opacity=".35" />
            </g>
          </svg>
        </div>
        <div className="gis-map-stack">
          <span className="mapping-caption">GIS / SPATIAL LAYERS</span>
          <svg viewBox="0 0 200 150" fill="none" stroke="currentColor" strokeWidth="1" className="gis-layers">
            <path d="m20 100 80-40 80 40-80 40ZM20 78l80-40 80 40-80 40ZM20 56l80-40 80 40-80 40Z" />
            <path d="m44 44 25 12 19-5 23 21 36-16m-90 4 36-28m11 52 38-51" opacity=".55" />
            <circle cx="88" cy="51" r="3" /><circle cx="111" cy="72" r="3" />
          </svg>
        </div>
        <div className="panorama-capture">
          <span className="mapping-caption">360° / SPATIAL CAPTURE</span>
          <svg viewBox="0 0 200 160" fill="none" stroke="currentColor" strokeWidth="1">
            <ellipse cx="100" cy="92" rx="75" ry="29" strokeDasharray="3 5" opacity=".5" />
            <ellipse cx="100" cy="92" rx="54" ry="18" opacity=".4" />
            <rect x="88" y="36" width="24" height="69" rx="10" />
            <circle cx="100" cy="52" r="7" /><circle cx="100" cy="52" r="3" />
            <path d="M100 105v28m-18 10 18-10 18 10M94 79h12" />
            <g className="panorama-sweep"><path d="m100 92 63-22m-63 22 63 22" opacity=".7" /><circle cx="163" cy="70" r="3" fill="currentColor" /></g>
          </svg>
        </div>
        <div className="orthomosaic-map">
          <span className="mapping-caption">ORTHOMOSAIC / PARCELS</span>
          <svg viewBox="0 0 210 160" fill="none" stroke="currentColor" strokeWidth=".75" className="parcel-landscape">
            <rect x="12" y="20" width="186" height="116" rx="3" className="parcel-base" />
            <path d="M13 21h54l-5 32-49 15ZM68 21h55l-6 44-55-12ZM124 21h73v44l-45 9-35-9ZM13 69l49-16 20 32-69 25ZM82 85l35-20 35 9-12 61H93ZM13 111l69-26 11 50H13Z" className="parcel-fields" />
            <path d="M198 84c-29-18-28 10-45 12s-14 31-36 40" className="parcel-water" strokeWidth="7" />
            <path d="M25 136 64 89l43-17 31-51" className="parcel-road-edge" strokeWidth="8" />
            <path d="M25 136 64 89l43-17 31-51" className="parcel-road" strokeWidth="3" />
            <path d="m62 53 55 12-10 7-43 17Z" className="parcel-selected" strokeWidth="1.2" />
            <g className="parcel-buildings">
              <path d="m76 61 12 3-3 10-12-3ZM92 60l12 3-2 8-12-3ZM53 98l9 7-7 9-9-7ZM115 48l10 5-5 9-10-5Z" />
            </g>
            <g fill="currentColor" opacity=".25">{[[27,36],[37,42],[44,32],[156,39],[170,44],[180,34],[28,84],[39,79],[161,119],[175,113]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" />)}</g>
            <g fill="currentColor"><circle cx="62" cy="53" r="2" /><circle cx="117" cy="65" r="2" /><circle cx="64" cy="89" r="2" /></g>
            <path className="orthomosaic-scan" d="M13 25h184" strokeWidth="1.4" />
            <path d="M7 31V15h17m162 0h17v16M7 125v16h17m162 0h17v-16" strokeWidth="1" />
          </svg>
        </div>
        <div className="survey-beacon survey-beacon-one"><span /></div>
        <div className="survey-beacon survey-beacon-two"><span /></div>
      </div>
    </div>
  )
}
