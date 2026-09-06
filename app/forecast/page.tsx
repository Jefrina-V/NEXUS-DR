'use client'

import { CloudLightningIcon, SatelliteDishIcon, ThermometerIcon } from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts'
import { useLanguage } from '@/components/language-provider'
import { PageHeader } from '@/components/page-header'
import { StatTile } from '@/components/risk-bits'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { bandMeta, districts, forecastSeries, rainfall14d, weatherCells } from '@/lib/nexus-data'
import { cn } from '@/lib/utils'

const forecastConfig = {
  risk: { label: 'Fused risk score', color: 'var(--chart-3)' },
  soil: { label: 'Soil saturation %', color: 'var(--chart-1)' },
  rainfall: { label: 'Rainfall mm / 6h', color: 'var(--chart-2)' },
} satisfies ChartConfig

const rainConfig = {
  mm: { label: 'Rainfall mm', color: 'var(--chart-1)' },
} satisfies ChartConfig

const peak = forecastSeries.reduce((a, b) => (b.risk > a.risk ? b : a))
const crossing = forecastSeries.find((p) => p.risk >= 75)

export default function ForecastPage() {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={t('page.forecast.eyebrow')}
        title={t('page.forecast.title')}
        actions={
          <Badge variant="outline" className="gap-1.5 font-mono">
            <SatelliteDishIcon />
            IMD API · 15 min cadence
          </Badge>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Peak projected risk" value={`${peak.risk}`} note={`Expected ${peak.t} — Dima Hasao`} accent="severe" />
        <StatTile label="Threshold crossing" value={crossing?.t ?? '—'} note="Score enters severe evacuation band" accent="signal" />
        <StatTile label="72h rainfall total" value="230 mm" note="Against a 180 mm terrain threshold" accent="signal" />
        <StatTile label="Active weather systems" value={String(weatherCells.length)} note="Tracked convective clusters" accent="primary" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">72-hour risk trajectory — Dima Hasao</CardTitle>
          <CardDescription className="text-xs">
            Rainfall input (bars), soil saturation and the resulting fused risk score, with the severe band marked at 75
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={forecastConfig} className="h-[320px] w-full">
            <AreaChart data={forecastSeries} margin={{ left: 4, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-risk)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-risk)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="t" tickLine={false} axisLine={false} tickMargin={8} className="font-mono text-[10px]" />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={28} className="font-mono text-[10px]" />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <ReferenceLine
                y={75}
                stroke="var(--risk-severe)"
                strokeDasharray="6 5"
                label={{ value: 'Severe band', position: 'insideTopRight', fill: 'var(--risk-severe)', fontSize: 10 }}
              />
              <Bar dataKey="rainfall" fill="var(--color-rainfall)" radius={2} barSize={12} opacity={0.55} />
              <Area
                dataKey="risk"
                type="monotone"
                stroke="var(--color-risk)"
                strokeWidth={2.2}
                fill="url(#riskFill)"
              />
              <Line dataKey="soil" type="monotone" stroke="var(--color-soil)" strokeWidth={1.6} dot={false} strokeDasharray="5 4" />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Antecedent rainfall — 14 days</CardTitle>
            <CardDescription className="text-xs">
              Saturation builds over weeks; the trigger event only finishes the job
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={rainConfig} className="h-[220px] w-full">
              <BarChart data={rainfall14d} margin={{ left: 4, right: 8, top: 8 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="d" tickLine={false} axisLine={false} tickMargin={8} className="font-mono text-[9px]" interval={1} />
                <YAxis tickLine={false} axisLine={false} width={28} className="font-mono text-[10px]" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="mm" fill="var(--color-mm)" radius={3} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <CloudLightningIcon className="size-4 text-signal" />
              Tracked weather systems
            </CardTitle>
            <CardDescription className="text-xs">Nowcast systems mapped to the districts they load</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {weatherCells.map((cell) => {
              const meta = bandMeta[cell.severity]
              return (
                <div key={cell.system} className={cn('flex flex-col gap-2 rounded-lg border p-3', meta.border, meta.bg)}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium">{cell.system}</p>
                    <span className={cn('font-mono text-[10px]', meta.text)}>{cell.window}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">{cell.detail}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cell.districts.map((dn) => (
                      <Badge key={dn} variant="outline" className="font-mono text-[10px]">
                        {dn}
                      </Badge>
                    ))}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <ThermometerIcon className="size-4 text-primary" />
            District outlook — next 48 hours
          </CardTitle>
          <CardDescription className="text-xs">
            Projected direction of travel, ranked by expected score at +24 hours
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[...districts]
            .sort((a, b) => b.score + b.delta - (a.score + a.delta))
            .map((d) => {
              const projected = Math.max(0, Math.min(100, d.score + Math.round(d.delta * 1.4)))
              const meta = bandMeta[projected >= 85 ? 'severe' : projected >= 70 ? 'high' : projected >= 50 ? 'moderate' : 'low']
              return (
                <div key={d.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{d.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {d.rainfall72h} mm / 72h · soil {Math.round(d.soilMoisture * 100)}%
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs tabular-nums">
                    <span className="text-muted-foreground">{d.score}</span>
                    <span className="text-muted-foreground">→</span>
                    <span style={{ color: meta.cssVar }}>{projected}</span>
                  </div>
                </div>
              )
            })}
        </CardContent>
      </Card>
    </div>
  )
}
