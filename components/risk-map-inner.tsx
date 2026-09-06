'use client'

import 'leaflet/dist/leaflet.css'
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, Tooltip } from 'react-leaflet'
import { bandMeta, bandOf, districts, roads, type Road } from '@/lib/nexus-data'

const roadColor: Record<Road['status'], string> = {
  open: 'var(--risk-low)',
  'at-risk': 'var(--risk-moderate)',
  blocked: 'var(--risk-severe)',
}

export type RiskMapProps = {
  showDistricts?: boolean
  showRoads?: boolean
  selectedId?: string | null
  onSelectDistrict?: (id: string) => void
  onSelectRoad?: (id: string) => void
  center?: [number, number]
  zoom?: number
}

export default function RiskMapInner({
  showDistricts = true,
  showRoads = false,
  selectedId = null,
  onSelectDistrict,
  onSelectRoad,
  center = [25.6, 92.4],
  zoom = 6,
}: RiskMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      className="size-full"
      style={{ height: '100%', width: '100%' }}
      worldCopyJump={false}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
        maxZoom={18}
        className="basemap-dark"
      />

      {showRoads &&
        roads.map((road) => (
          <Polyline
            key={road.id}
            positions={road.path}
            pathOptions={{
              color: roadColor[road.status],
              weight: road.status === 'blocked' ? 5 : 4,
              opacity: 0.85,
              dashArray: road.status === 'at-risk' ? '8 6' : undefined,
            }}
            eventHandlers={{ click: () => onSelectRoad?.(road.id) }}
          >
            <Tooltip sticky>
              <span className="font-mono text-[11px]">
                {road.name} · {road.status.toUpperCase()} · {road.blockProbability}% block risk
              </span>
            </Tooltip>
          </Polyline>
        ))}

      {showDistricts &&
        districts.map((d) => {
          const band = bandOf(d.score)
          const selected = selectedId === d.id
          return (
            <CircleMarker
              key={d.id}
              center={[d.lat, d.lon]}
              radius={8 + (d.score / 100) * 14}
              pathOptions={{
                color: bandMeta[band].cssVar,
                fillColor: bandMeta[band].cssVar,
                fillOpacity: selected ? 0.55 : 0.28,
                weight: selected ? 3 : 1.5,
              }}
              eventHandlers={{ click: () => onSelectDistrict?.(d.id) }}
            >
              <Tooltip direction="top" offset={[0, -6]}>
                <span className="font-mono text-[11px]">
                  {d.name} · {d.score}
                </span>
              </Tooltip>
              <Popup>
                <div className="flex min-w-48 flex-col gap-1.5">
                  <p className="text-sm font-semibold">{d.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {d.state} · Seismic zone {d.seismicZone}
                  </p>
                  <p className="font-mono text-xs" style={{ color: bandMeta[band].cssVar }}>
                    Risk {d.score}/100 · {bandMeta[band].label}
                  </p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    24h rain {d.rainfall24h} mm · soil {Math.round(d.soilMoisture * 100)}%
                  </p>
                  <p className="text-[11px] leading-relaxed">{d.advisory}</p>
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
    </MapContainer>
  )
}
