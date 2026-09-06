'use client'

import {
  AlertTriangleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  RouteIcon,
  UsersIcon,
} from 'lucide-react'
import * as React from 'react'

import { useLanguage } from '@/components/language-provider'
import { PageHeader } from '@/components/page-header'
import { StatTile } from '@/components/risk-bits'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group'

import { roads } from '@/lib/nexus-data'
import { cn } from '@/lib/utils'

const statusMeta = {
  blocked: {
    label: 'Blocked',
    cls: 'border-risk-severe/40 bg-risk-severe/12 text-risk-severe',
    icon: AlertTriangleIcon,
  },
  'at-risk': {
    label: 'At risk',
    cls: 'border-risk-high/40 bg-risk-high/12 text-risk-high',
    icon: AlertTriangleIcon,
  },
  open: {
    label: 'Open',
    cls: 'border-risk-low/40 bg-risk-low/12 text-risk-low',
    icon: CheckCircle2Icon,
  },
} as const

export default function RoadsPage() {
  const { t } = useLanguage()

  // ==============================
  // STATES
  // ==============================

  const [filter, setFilter] = React.useState<string>('all')
  const [selectedId, setSelectedId] = React.useState(roads[0].id)

  const [emergencyDeclared, setEmergencyDeclared] =
    React.useState(false)

  const [detourPublished, setDetourPublished] =
    React.useState(false)

  const [publishedCount, setPublishedCount] =
    React.useState(6)

  // ==============================
  // ROAD DATA
  // ==============================

  const visible =
    filter === 'all'
      ? roads
      : roads.filter((r) => r.status === filter)

  const selected =
    roads.find((r) => r.id === selectedId) ?? roads[0]

  const blocked = roads.filter(
    (r) => r.status === 'blocked',
  )

  const cutOff = roads.reduce(
    (sum, r) => sum + r.villagesCutOff,
    0,
  )

  // ==============================
  // EXPORT DETOUR ADVISORY
  // ==============================

  const handleExportAdvisory = () => {
    const generatedAt = new Date().toLocaleString()

    const lines = [
      'NEXUS-DR — Road Detour Advisory',
      `Generated: ${generatedAt}`,
      `Corridors affected: ${blocked.length} blocked, ${cutOff} villages cut off`,
      '',
      ...roads
        .filter((r) => r.status !== 'open')
        .map((r) =>
          [
            `${r.name} — ${statusMeta[r.status].label}`,
            `  Chokepoint: ${r.chokepoint}`,
            `  Villages cut off: ${r.villagesCutOff}`,
            `  Recommended alternate: ${r.alternate}`,
            `  Detour cost: ${r.alternateDetour}`,
            `  Restoration ETA: ${r.restoreEta}`,
            '',
          ].join('\n'),
        ),
    ]

    const blob = new Blob(
      [lines.join('\n')],
      {
        type: 'text/plain;charset=utf-8',
      },
    )

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')

    link.href = url

    link.download =
      `detour-advisory-${new Date()
        .toISOString()
        .slice(0, 10)}.txt`

    document.body.appendChild(link)

    link.click()

    link.remove()

    URL.revokeObjectURL(url)
  }

  // ==============================
  // PUBLISH DETOUR
  // ==============================

  const handlePublishDetour = () => {
    if (detourPublished) return

    setDetourPublished(true)

    setPublishedCount(
      (count) => count + 1,
    )

    window.alert(
      `DETOUR PUBLISHED\n\n` +
        `${selected.name}\n\n` +
        `Alternate: ${selected.alternate}\n\n` +
        `Published to:\n` +
        `• Mobile App\n` +
        `• SMS alerts\n` +
        `• Maps feed\n` +
        `• Field App`,
    )
  }

  // ==============================
  // DECLARE DISTRICT EMERGENCY
  // ==============================

  const handleDeclareEmergency = () => {
    if (emergencyDeclared) return

    setEmergencyDeclared(true)

    window.alert(
      `DISTRICT EMERGENCY DECLARED\n\n` +
        `${selected.district}\n\n` +
        `Emergency response teams have been notified.`,
    )
  }

  // ==============================
  // PAGE
  // ==============================

  return (
    <div className="flex flex-col gap-6 py-1">

      {/* PAGE HEADER */}

      <PageHeader
        eyebrow={t('page.roads.eyebrow')}
        title={t('page.roads.title')}
      
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportAdvisory}
          >
            <RouteIcon data-icon="inline-start" />

            {t('btn.exportDetourAdvisory')}
          </Button>
        }
      />

      {/* STATISTICS */}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

        <StatTile
          label="Corridors monitored"
          value={String(roads.length)}
          note="NH + state highways in deployment"
        />

        <StatTile
          label="Currently blocked"
          value={String(blocked.length)}
          note="Clearance crews assigned"
          accent="severe"
        />

        <StatTile
          label="Villages cut off"
          value={String(cutOff)}
          note="Across all degraded corridors"
          accent="severe"
        />

        <StatTile
          label="Detours published"
          value={String(publishedCount)}
          note="Pushed to app, SMS and Maps feed"
          accent="low"
        />

      </div>

      {/* FILTER */}

      <div className="flex flex-wrap items-center justify-between gap-3">

        <ToggleGroup
          value={[filter]}
          onValueChange={(v) =>
            setFilter(
              (v as string[])[0] ?? 'all',
            )
          }
          className="flex-wrap"
          aria-label="Filter corridors by status"
        >
          <ToggleGroupItem value="all">
            All
          </ToggleGroupItem>

          <ToggleGroupItem value="blocked">
            Blocked
          </ToggleGroupItem>

          <ToggleGroupItem value="at-risk">
            At risk
          </ToggleGroupItem>

          <ToggleGroupItem value="open">
            Open
          </ToggleGroupItem>
        </ToggleGroup>

        <p className="font-mono text-[11px] text-muted-foreground">
          {visible.length} of {roads.length} corridors shown
        </p>

      </div>

      {/* MAIN CONTENT */}

      <div className="grid gap-5 xl:grid-cols-[1fr_400px]">

        {/* ROAD LIST */}

        <div className="flex flex-col gap-3">

          {visible.map((road) => {

            const meta =
              statusMeta[road.status]

            const active =
              road.id === selected.id

            return (
              <button
                key={road.id}
                type="button"
                onClick={() =>
                  setSelectedId(road.id)
                }
                aria-pressed={active}
                className={cn(
                  'flex flex-col gap-3 rounded-xl border bg-card p-4 text-left transition-colors',
                  active
                    ? 'border-primary/50 bg-primary/[0.06]'
                    : 'border-border hover:border-primary/30',
                )}
              >

                {/* ROAD HEADER */}

                <div className="flex flex-wrap items-start justify-between gap-2">

                  <div className="flex flex-col gap-0.5">

                    <p className="text-sm font-medium">
                      {road.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {road.corridor}
                    </p>

                  </div>

                  <Badge
                    variant="outline"
                    className={cn(
                      'gap-1.5',
                      meta.cls,
                    )}
                  >
                    <meta.icon />

                    {meta.label}
                  </Badge>

                </div>

                {/* PROBABILITY */}

                <div className="flex flex-col gap-1.5">

                  <div className="flex items-center justify-between font-mono text-[11px]">

                    <span className="text-muted-foreground">
                      Blockage probability (next 24h)
                    </span>

                    <span className="tabular-nums text-foreground">
                      {road.blockProbability}%
                    </span>

                  </div>

                  <Progress
                    value={road.blockProbability}
                    className="h-1.5"
                  />

                </div>

                {/* ROAD DETAILS */}

                <dl className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[10px] sm:grid-cols-3">

                  <div className="flex flex-col">

                    <dt className="text-muted-foreground uppercase tracking-[0.12em]">
                      Chokepoint
                    </dt>

                    <dd className="truncate text-foreground">
                      {road.chokepoint}
                    </dd>

                  </div>

                  <div className="flex flex-col">

                    <dt className="text-muted-foreground uppercase tracking-[0.12em]">
                      Villages cut
                    </dt>

                    <dd className="text-foreground">
                      {road.villagesCutOff}
                    </dd>

                  </div>

                  <div className="flex flex-col">

                    <dt className="text-muted-foreground uppercase tracking-[0.12em]">
                      District
                    </dt>

                    <dd className="truncate text-foreground">
                      {road.district}
                    </dd>

                  </div>

                </dl>

              </button>
            )
          })}

        </div>

        {/* RIGHT SIDE PANEL */}

        <Card className="h-fit xl:sticky xl:top-20">

          <CardHeader>

            <CardDescription className="font-mono text-[10px] tracking-[0.16em] uppercase">
              {t('section.reroutePlan')}
            </CardDescription>

            <CardTitle className="text-base leading-snug">
              {selected.name}
            </CardTitle>

          </CardHeader>

          <CardContent className="flex flex-col gap-4">

            {/* WHY IT MATTERS */}

            <div className="rounded-lg border border-border bg-muted/40 p-3">

              <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                Why this corridor matters
              </p>

              <p className="mt-1 text-xs leading-relaxed text-foreground">
                {selected.criticality}
              </p>

            </div>

            {/* VILLAGES */}

            <div className="flex items-center gap-3 rounded-lg border border-risk-severe/30 bg-risk-severe/[0.08] p-3">

              <UsersIcon className="size-4 shrink-0 text-risk-severe" />

              <p className="text-xs leading-relaxed">

                <span className="font-mono font-semibold text-risk-severe">
                  {selected.villagesCutOff} villages
                </span>{' '}
                lose their primary access if this chokepoint fails.

              </p>

            </div>

            <Separator />

            {/* ALTERNATE ROUTE */}

            <div className="flex flex-col gap-2">

              <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                Recommended alternate
              </p>

              <div className="flex items-start gap-2 text-sm">

                <ArrowRightIcon className="mt-0.5 size-4 shrink-0 text-signal" />

                <span className="leading-relaxed">
                  {selected.alternate}
                </span>

              </div>

              <p className="font-mono text-[11px] text-signal">
                {selected.alternateDetour}
              </p>

            </div>

            <Separator />

            {/* DETAILS */}

            <dl className="flex flex-col gap-2 font-mono text-[11px]">

              <div className="flex items-start justify-between gap-3">

                <dt className="text-muted-foreground">
                  Restoration ETA
                </dt>

                <dd className="text-right text-foreground">
                  {selected.restoreEta}
                </dd>

              </div>

              <div className="flex items-start justify-between gap-3">

                <dt className="text-muted-foreground">
                  Chokepoint
                </dt>

                <dd className="text-right text-foreground">
                  {selected.chokepoint}
                </dd>

              </div>

            </dl>

            {/* ACTION BUTTONS */}

            <div className="flex flex-col gap-2">

              {/* PUBLISH DETOUR */}

              <Button
                className="w-full"
                onClick={handlePublishDetour}
                disabled={detourPublished}
              >

                {detourPublished ? (
                  <>
                    <CheckCircle2Icon data-icon="inline-start" />

                    Detour Published
                  </>
                ) : (
                  <>
                    <RouteIcon data-icon="inline-start" />

                    Publish detour to all channels
                  </>
                )}

              </Button>

              {/* DECLARE EMERGENCY */}

              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDeclareEmergency}
                disabled={emergencyDeclared}
              >

                {emergencyDeclared ? (
                  <>
                    <CheckCircle2Icon data-icon="inline-start" />

                    Emergency Declared
                  </>
                ) : (
                  <>
                    <AlertTriangleIcon data-icon="inline-start" />

                    Declare District Emergency
                  </>
                )}

              </Button>

            </div>

          </CardContent>

        </Card>

      </div>

    </div>
  )
}