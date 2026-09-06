'use client'

import {
  ArrowRightIcon,
  BellRingIcon,
  CircleAlertIcon,
  CpuIcon,
  MapPinIcon,
  RouteIcon,
  UsersIcon,
} from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import { useLanguage } from '@/components/language-provider'
import { PageHeader } from '@/components/page-header'
import { Delta, RiskBadge, RiskLegend, ScoreDial, StatTile } from '@/components/risk-bits'
import { RiskMap } from '@/components/risk-map'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { alertLog, bandMeta, bandOf, districts, roads, sensors } from '@/lib/nexus-data'
import { cn } from '@/lib/utils'

const sorted = [...districts].sort((a, b) => b.score - a.score)

export default function CommandMapPage() {
  const { t } = useLanguage()
  const [selectedId, setSelectedId] = React.useState(sorted[0].id)
  const [layer, setLayer] = React.useState('risk')
  const selected = districts.find((d) => d.id === selectedId) ?? sorted[0]
  const meta = bandMeta[bandOf(selected.score)]

  const severe = districts.filter((d) => d.score >= 85)
  const blocked = roads.filter((r) => r.status !== 'open')
  const peopleAtRisk = districts.filter((d) => d.score >= 70).reduce((s, d) => s + d.population, 0)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={t('page.command.eyebrow')}
        title={t('page.command.title')}
         actions={
          <>
            <Button variant="outline" nativeButton={false} render={<Link href="/roads" />}>
              <RouteIcon data-icon="inline-start" />
              Road status
            </Button>
           <Button
  nativeButton={false}
  render={<Link href="/alerts" />}
>
  <BellRingIcon data-icon="inline-start" />
  Issue alert
</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Severe districts" value={String(severe.length)} note={severe.map((d) => d.name).join(', ')} accent="severe" />
        <StatTile label="Population under alert" value={`${(peopleAtRisk / 1_000_000).toFixed(1)} M`} note="Districts scoring 70+" accent="signal" />
        <StatTile label="Corridors impaired" value={`${blocked.length} / ${roads.length}`} note="2 blocked, 3 at risk" accent="severe" />
        <StatTile label="Mean lead time" value="31 h" note="Ensemble forecast horizon" accent="low" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <Card className="overflow-hidden p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <MapPinIcon className="size-4 text-primary" />
              <p className="text-sm font-medium">NER risk heatmap</p>
              <Badge variant="outline" className="font-mono">
                live
              </Badge>
            </div>
            <ToggleGroup
              value={[layer]}
              onValueChange={(v) => v[0] && setLayer(v[0] as string)}
              variant="outline"
              size="sm"
              spacing={0}
            >
              <ToggleGroupItem value="risk">Risk zones</ToggleGroupItem>
              <ToggleGroupItem value="both">+ Roads</ToggleGroupItem>
              <ToggleGroupItem value="roads">Roads only</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="relative h-[420px] sm:h-[520px]">
            <RiskMap
              showDistricts={layer !== 'roads'}
              showRoads={layer !== 'risk'}
              selectedId={selectedId}
              onSelectDistrict={setSelectedId}
            />
            <div className="pointer-events-none absolute bottom-3 left-3 z-[400] rounded-lg border border-border bg-background/85 px-3 py-2 backdrop-blur-sm">
              <RiskLegend />
            </div>
          </div>
        </Card>

        <Card className="flex flex-col gap-0 overflow-hidden p-0">
          <CardHeader className="border-b border-border px-4 py-3">
            <CardTitle className="text-sm">Districts by risk score</CardTitle>
            <CardDescription className="text-xs">Tap a district to inspect its explainable score</CardDescription>
          </CardHeader>
          <div className="max-h-[470px] overflow-y-auto">
            <ul className="divide-y divide-border">
              {sorted.map((d) => {
                const active = d.id === selectedId
                return (
                  <li key={d.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(d.id)}
                      aria-pressed={active}
                      className={cn(
                        'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50',
                        active && 'bg-primary/10',
                      )}
                    >
                      <span
                        className="h-9 w-1 shrink-0 rounded-full"
                        style={{ background: bandMeta[bandOf(d.score)].cssVar }}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium">{d.name}</span>
                        </span>
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {d.state} · {d.villages} villages · {d.rainfall24h} mm/24h
                        </span>
                      </span>
                      <span className="flex flex-col items-end gap-1">
                        <span
                          className="font-mono text-sm font-semibold tabular-nums"
                          style={{ color: bandMeta[bandOf(d.score)].cssVar }}
                        >
                          {d.score}
                        </span>
                        <Delta value={d.delta} />
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </Card>
      </div>

      <Card className={cn('border', meta.border)}>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle className="text-base">{selected.name}</CardTitle>
            <RiskBadge score={selected.score} />
            <Badge variant="outline" className="font-mono">
              {selected.state}
            </Badge>
            <Badge variant="outline" className="font-mono">
              Seismic {selected.seismicZone}
            </Badge>
          </div>
          <CardDescription>{selected.advisory}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex items-center gap-5">
            <ScoreDial score={selected.score} />
            <dl className="grid gap-y-2 font-mono text-[11px]">
              <div className="flex items-center gap-2">
                <dt className="w-24 text-muted-foreground">Rain 24h</dt>
                <dd>{selected.rainfall24h} mm</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="w-24 text-muted-foreground">Rain 72h</dt>
                <dd>{selected.rainfall72h} mm</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="w-24 text-muted-foreground">Soil sat.</dt>
                <dd>{Math.round(selected.soilMoisture * 100)}%</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="w-24 text-muted-foreground">Mean slope</dt>
                <dd>{selected.slope}°</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="w-24 text-muted-foreground">Population</dt>
                <dd>{selected.population.toLocaleString('en-IN')}</dd>
              </div>
            </dl>
          </div>

          <Separator className="lg:hidden" />

          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                Why this score
              </p>
              <Button
  variant="ghost"
  size="sm"
  nativeButton={false}
  render={<Link href="/risk-engine" />}
>

                Full explanation
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </div>
            {selected.drivers.slice(0, 4).map((driver) => {
              const positive = driver.points >= 0
              return (
                <div key={driver.label} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm">{driver.label}</p>
                    <p
                      className={cn(
                        'font-mono text-xs tabular-nums',
                        positive ? 'text-risk-high' : 'text-risk-low',
                      )}
                    >
                      {positive ? '+' : ''}
                      {driver.points} pts
                    </p>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn('h-full rounded-full', positive ? 'bg-risk-high' : 'bg-risk-low')}
                      style={{ width: `${Math.min(100, Math.abs(driver.points) * 2.8)}%` }}
                    />
                  </div>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">{driver.detail}</p>
                </div>
              )
            })}
            <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
              <span className="text-foreground">Historical context:</span> {selected.lastEvent}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <CircleAlertIcon className="size-4 text-signal" />
              Live warning feed
            </CardTitle>
            <CardDescription className="text-xs">Multichannel dispatches in the last 4 hours</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {alertLog.map((a) => (
              <div key={a.id} className="flex flex-col gap-2 rounded-lg border border-border p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">{a.id}</span>
                  <RiskBadge score={a.band === 'severe' ? 90 : a.band === 'high' ? 78 : 60} />
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground">{a.issued}</span>
                </div>
                <p className="text-sm leading-snug">{a.headline}</p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {a.channels.map((c) => (
                    <Badge key={c} variant="secondary" className="font-mono text-[10px]">
                      {c}
                    </Badge>
                  ))}
                  <span className="ml-auto flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                    <UsersIcon className="size-3" />
                    {Math.round((a.delivered / a.reach) * 100)}% of {(a.reach / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <CpuIcon className="size-4 text-primary" />
              IoT slope sensor network
            </CardTitle>
            <CardDescription className="text-xs">
              Telemetry gaps are penalised in the score rather than silently ignored
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {sensors.map((s) => (
                <li key={s.id} className="flex items-center gap-3 py-2.5">
                  <span
                    className={cn(
                      'size-2 shrink-0 rounded-full',
                      s.status === 'online' ? 'bg-risk-low' : s.status === 'degraded' ? 'bg-risk-moderate' : 'bg-risk-severe',
                    )}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2">
                      <span className="font-mono text-xs">{s.id}</span>
                      <span className="truncate text-[11px] text-muted-foreground">
                        {s.type} · {s.district}
                      </span>
                    </span>
                    <span className="block truncate text-[11px]">{s.reading}</span>
                  </span>
                  <span className="shrink-0 text-right font-mono text-[10px] text-muted-foreground">
                    <span className="block">{s.battery}% batt</span>
                    <span className="block">{s.lastSync}</span>
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
