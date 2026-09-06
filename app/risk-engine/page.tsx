'use client'

import { RotateCcwIcon, ShieldCheckIcon, SlidersHorizontalIcon } from 'lucide-react'
import * as React from 'react'
import { useLanguage } from '@/components/language-provider'
import { PageHeader } from '@/components/page-header'
import { RiskBadge, ScoreDial, StatTile } from '@/components/risk-bits'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { bandMeta, bandOf, districts, falsePositives, modelCard } from '@/lib/nexus-data'
import { cn } from '@/lib/utils'

function num(v: number | readonly number[]) {
  return Array.isArray(v) ? v[0] : (v as number)
}

export default function RiskEnginePage() {
  const { t } = useLanguage()

  const [id, setId] = React.useState(districts[0].id)

  const d = districts.find((x) => x.id === id) ?? districts[0]

  const [rain, setRain] = React.useState(d.rainfall72h)
  const [soil, setSoil] = React.useState(Math.round(d.soilMoisture * 100))
  const [creep, setCreep] = React.useState(6)

  React.useEffect(() => {
    setRain(d.rainfall72h)
    setSoil(Math.round(d.soilMoisture * 100))
    setCreep(6)
  }, [d])

  const rainEffect = (rain - d.rainfall72h) * 0.11
  const soilEffect = (soil - d.soilMoisture * 100) * 0.42
  const creepEffect = (creep - 6) * 0.55

  const simulated = Math.max(
    0,
    Math.min(
      100,
      Math.round(d.score + rainEffect + soilEffect + creepEffect),
    ),
  )

  const dirty = simulated !== d.score

  const maxPts = Math.max(
    ...d.drivers.map((x) => Math.abs(x.points)),
  )

  return (
    <div className="flex flex-col gap-6">

      {/* Risk Engine header */}
      <PageHeader
        eyebrow={t('page.riskEngine.eyebrow')}
        title=""
      />

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {modelCard.metrics.map((m) => (
          <StatTile
            key={m.label}
            label={m.label}
            value={m.value}
            accent="primary"
          />
        ))}
      </div>

      {/* District risk analysis */}
      <Card className="p-0">

        {/* District selector */}
        <div className="flex flex-wrap gap-1.5 border-b border-border p-3">
          {districts.map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setId(x.id)}
              aria-pressed={x.id === id}
              className={cn(
                'flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[11px] transition-colors',
                x.id === id
                  ? 'border-primary/50 bg-primary/12 text-foreground'
                  : 'border-border text-muted-foreground hover:bg-accent/60 hover:text-foreground',
              )}
            >
              <span
                className="size-1.5 rounded-full"
                style={{
                  background: bandMeta[bandOf(x.score)].cssVar,
                }}
              />

              {x.name}

              <span className="tabular-nums">
                {x.score}
              </span>
            </button>
          ))}
        </div>

        <CardContent className="grid gap-6 py-5 xl:grid-cols-[300px_1fr]">

          {/* Left section */}
          <div className="flex flex-col gap-4">

            <div className="flex items-center gap-4">
              <ScoreDial score={dirty ? simulated : d.score} />

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">
                  {d.name}
                </p>

                <p className="text-[11px] text-muted-foreground">
                  {d.state}
                </p>

                <RiskBadge
                  score={dirty ? simulated : d.score}
                />

                {dirty ? (
                  <p className="font-mono text-[10px] text-signal">
                    simulated · baseline {d.score}
                  </p>
                ) : (
                  <p className="font-mono text-[10px] text-muted-foreground">
                    live fused score
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* What-if simulator */}
            <div className="flex flex-col gap-4">

              <div className="flex items-center gap-2">
                <SlidersHorizontalIcon className="size-4 text-primary" />

                <p className="text-sm font-medium">
                  What-if simulator
                </p>
              </div>

              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Officers can test scenarios before committing to an evacuation decision — the same attribution logic
                drives the simulated score.
              </p>

              {/* Rainfall */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between font-mono text-[11px]">
                  <span className="text-muted-foreground">
                    Rainfall 72h
                  </span>

                  <span>
                    {rain} mm
                  </span>
                </div>

                <Slider
                  value={[rain]}
                  onValueChange={(v) => setRain(num(v))}
                  min={0}
                  max={500}
                  step={5}
                />
              </div>

              {/* Soil */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between font-mono text-[11px]">
                  <span className="text-muted-foreground">
                    Soil saturation
                  </span>

                  <span>
                    {soil}%
                  </span>
                </div>

                <Slider
                  value={[soil]}
                  onValueChange={(v) => setSoil(num(v))}
                  min={30}
                  max={100}
                  step={1}
                />
              </div>

              {/* Ground creep */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between font-mono text-[11px]">
                  <span className="text-muted-foreground">
                    Ground creep / 36h
                  </span>

                  <span>
                    {creep} mm
                  </span>
                </div>

                <Slider
                  value={[creep]}
                  onValueChange={(v) => setCreep(num(v))}
                  min={0}
                  max={40}
                  step={1}
                />
              </div>

              {/* Reset */}
              <Button
                variant="outline"
                size="sm"
                disabled={!dirty}
                onClick={() => {
                  setRain(d.rainfall72h)
                  setSoil(Math.round(d.soilMoisture * 100))
                  setCreep(6)
                }}
              >
                <RotateCcwIcon data-icon="inline-start" />
                Reset to live values
              </Button>

            </div>
          </div>

          {/* Right section */}
          <div className="flex flex-col gap-5">

            <div>
              <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                Factor attribution — {d.name}
              </p>

              <p className="mt-1 text-[11px] text-muted-foreground">
                Positive bars raise risk, negative bars are mitigating evidence the model credits.
              </p>
            </div>

            <ul className="flex flex-col gap-3.5">
              {d.drivers.map((driver) => {
                const positive = driver.points >= 0

                const width =
                  (Math.abs(driver.points) / maxPts) * 50

                return (
                  <li
                    key={driver.label}
                    className="flex flex-col gap-1.5"
                  >
                    <div className="flex items-baseline justify-between gap-4">

                      <p className="text-sm">
                        {driver.label}
                      </p>

                      <p
                        className={cn(
                          'font-mono text-xs tabular-nums',
                          positive
                            ? 'text-risk-high'
                            : 'text-risk-low',
                        )}
                      >
                        {positive ? '+' : ''}
                        {driver.points}
                      </p>

                    </div>

                    <div className="relative h-2 rounded-full bg-muted/60">

                      <span className="absolute inset-y-0 left-1/2 w-px bg-border" />

                      <span
                        className={cn(
                          'absolute inset-y-0 rounded-full',
                          positive
                            ? 'left-1/2 bg-risk-high'
                            : 'right-1/2 bg-risk-low',
                        )}
                        style={{
                          width: `${width}%`,
                        }}
                      />

                    </div>

                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      {driver.detail}
                    </p>
                  </li>
                )
              })}
            </ul>

            {/* Recommended action */}
            <div className="rounded-lg border border-border bg-muted/30 p-3">

              <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                Recommended action
              </p>

              <p className="mt-1.5 text-sm leading-relaxed">
                {d.advisory}
              </p>

              <p className="mt-2 text-[11px] text-muted-foreground">
                Historical precedent: {d.lastEvent}
              </p>

            </div>

          </div>
        </CardContent>
      </Card>

      {/* Bottom cards */}
      <div className="grid gap-4 lg:grid-cols-2">

        {/* Ensemble */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Ensemble composition
            </CardTitle>

            <CardDescription className="text-xs">
              Each member is scored independently, then weighted by validated skill on the GSI inventory
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            {modelCard.ensemble.map((m) => (
              <div
                key={m.name}
                className="flex flex-col gap-1.5"
              >

                <div className="flex items-baseline justify-between gap-3">

                  <p className="text-sm">
                    {m.name}
                  </p>

                  <p className="font-mono text-xs text-muted-foreground tabular-nums">
                    w {m.weight}% · AUC {m.auc}
                  </p>

                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${m.weight * 2.6}%`,
                    }}
                  />
                </div>

                <p className="text-[11px] text-muted-foreground">
                  {m.note}
                </p>

              </div>
            ))}
          </CardContent>
        </Card>

        {/* False positive management */}
        <Card>

          <CardHeader>

            <CardTitle className="flex items-center gap-2 text-sm">
              <ShieldCheckIcon className="size-4 text-risk-low" />

              False-positive management
            </CardTitle>

            <CardDescription className="text-xs">
              Every over-warning is investigated and fed back, so trust in the alert is protected
            </CardDescription>

          </CardHeader>

          <CardContent className="p-0">

            <Table>

              <TableHeader>
                <TableRow>

                  <TableHead className="font-mono text-[10px] uppercase">
                    Case
                  </TableHead>

                  <TableHead className="font-mono text-[10px] uppercase">
                    Finding
                  </TableHead>

                  <TableHead className="font-mono text-[10px] uppercase">
                    Model correction
                  </TableHead>

                </TableRow>
              </TableHeader>

              <TableBody>

                {falsePositives.map((f) => (
                  <TableRow key={f.id}>

                    <TableCell className="align-top">
                      <p className="font-mono text-[11px]">
                        {f.id}
                      </p>

                      <p className="text-[11px] text-muted-foreground">
                        {f.district}
                      </p>
                    </TableCell>

                    <TableCell className="max-w-40 align-top text-[11px] leading-relaxed">
                      <p className="text-muted-foreground">
                        {f.triggered}
                      </p>

                      <p>
                        {f.outcome}
                      </p>
                    </TableCell>

                    <TableCell className="max-w-40 align-top text-[11px] leading-relaxed">
                      <p>
                        {f.action}
                      </p>

                      <p className="text-muted-foreground">
                        Verified: {f.verifiedBy}
                      </p>
                    </TableCell>

                  </TableRow>
                ))}

              </TableBody>

            </Table>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}