'use client'

import { ClockIcon, SirenIcon, SparklesIcon, UsersIcon } from 'lucide-react'
import * as React from 'react'
import { useLanguage } from '@/components/language-provider'
import { PageHeader } from '@/components/page-header'
import { StatTile } from '@/components/risk-bits'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { incidents } from '@/lib/nexus-data'
import { cn } from '@/lib/utils'

const stages = [
  { key: 'triage', labelKey: 'stage.triage', hint: 'Awaiting assignment' },
  { key: 'dispatched', labelKey: 'stage.dispatched', hint: 'Team en route' },
  { key: 'on-site', labelKey: 'stage.onSite', hint: 'Working' },
  { key: 'resolved', labelKey: 'stage.resolved', hint: 'Closed in SLA' },
] as const

function priorityTone(p: number) {
  if (p >= 90) return { text: 'text-risk-severe', bar: 'bg-risk-severe', label: 'P1' }
  if (p >= 75) return { text: 'text-risk-high', bar: 'bg-risk-high', label: 'P2' }
  if (p >= 50) return { text: 'text-risk-moderate', bar: 'bg-risk-moderate', label: 'P3' }
  return { text: 'text-risk-low', bar: 'bg-risk-low', label: 'P4' }
}

export default function ResponsePage() {
  const { t } = useLanguage()

  const [openId, setOpenId] = React.useState<string | null>(incidents[0].id)

  // Emergency button state
  const [emergencyDeclared, setEmergencyDeclared] = React.useState(false)

  const active = incidents.filter((i) => i.stage !== 'resolved')

  const peopleAtRisk = active.reduce(
    (s, i) => s + i.populationAtRisk,
    0,
  )

  // Declare district emergency
  const handleDeclareEmergency = () => {
    if (emergencyDeclared) return

    setEmergencyDeclared(true)

    window.alert(
      'DISTRICT EMERGENCY DECLARED\n\nEmergency response teams have been notified.',
    )
  }

  return (
    <div className="flex flex-col gap-6 py-1">
      <PageHeader
        eyebrow={t('page.response.eyebrow')}
        title={t('page.response.title')}
        description="Every incident is auto-ranked by a transparent priority score combining risk, population exposure and access status — so the scarcest resource in a disaster, attention, goes to the right place first."
        actions={
          <Button
            size="sm"
            onClick={handleDeclareEmergency}
            disabled={emergencyDeclared}
          >
            <SirenIcon data-icon="inline-start" />

            {emergencyDeclared
              ? 'District emergency declared'
              : t('btn.declareEmergency')}
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Active incidents"
          value={String(active.length)}
          note="Open across 12 districts"
          accent="severe"
        />

        <StatTile
          label="People at risk"
          value={peopleAtRisk.toLocaleString('en-IN')}
          note="Inside modelled runout zones"
          accent="severe"
        />

        <StatTile
          label="Teams engaged"
          value="7"
          note="NDRF, SDRF, BRO, municipal"
        />

        <StatTile
          label="Median dispatch time"
          value="9 min"
          note="From alert to team assignment"
          accent="low"
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-4">
        {stages.map((stage) => {
          const items = incidents.filter((i) => i.stage === stage.key)

          return (
            <section
              key={stage.key}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card/50 p-3"
            >
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex flex-col">
                  <h2 className="font-mono text-[11px] tracking-[0.16em] text-foreground uppercase">
                    {t(stage.labelKey)}
                  </h2>

                  <p className="text-[11px] text-muted-foreground">
                    {stage.hint}
                  </p>
                </div>

                <span className="font-mono text-sm tabular-nums text-muted-foreground">
                  {items.length}
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {items.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-[11px] text-muted-foreground">
                    Nothing here
                  </p>
                ) : (
                  items.map((inc) => {
                    const tone = priorityTone(inc.priority)
                    const open = openId === inc.id

                    return (
                      <article
                        key={inc.id}
                        className={cn(
                          'flex flex-col gap-2.5 rounded-lg border bg-card p-3 transition-colors',
                          open
                            ? 'border-primary/50'
                            : 'border-border',
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {inc.id}
                          </span>

                          <Badge
                            variant="outline"
                            className={cn(
                              'gap-1 font-mono',
                              tone.text,
                            )}
                          >
                            {tone.label} · {inc.priority}
                          </Badge>
                        </div>

                        <div className="flex flex-col gap-0.5">
                          <p className="text-sm leading-snug font-medium text-pretty">
                            {inc.location}
                          </p>

                          <p className="text-[11px] text-muted-foreground">
                            {inc.type}
                          </p>
                        </div>

                        <div className="h-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              tone.bar,
                            )}
                            style={{
                              width: `${inc.priority}%`,
                            }}
                          />
                        </div>

                        <dl className="flex flex-col gap-1 font-mono text-[10px]">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <UsersIcon className="size-3" />

                            <span className="text-foreground">
                              {inc.populationAtRisk.toLocaleString(
                                'en-IN',
                              )}
                            </span>

                            at risk
                          </div>

                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <ClockIcon className="size-3" />
                            {inc.reported}
                          </div>
                        </dl>

                        {open ? (
                          <div className="flex flex-col gap-2 rounded-md border border-primary/25 bg-primary/[0.06] p-2.5">
                            <div className="flex items-center gap-1.5">
                              <SparklesIcon className="size-3 text-primary" />

                              <p className="font-mono text-[10px] tracking-[0.14em] text-primary uppercase">
                                Why prioritised
                              </p>
                            </div>

                            <p className="text-[11px] leading-relaxed text-foreground">
                              {inc.reason}
                            </p>

                            <Separator className="bg-primary/20" />

                            <dl className="flex flex-col gap-1 font-mono text-[10px]">
                              <div className="flex justify-between gap-2">
                                <dt className="text-muted-foreground">
                                  Access
                                </dt>

                                <dd className="text-right text-foreground">
                                  {inc.accessStatus}
                                </dd>
                              </div>

                              <div className="flex justify-between gap-2">
                                <dt className="text-muted-foreground">
                                  Team
                                </dt>

                                <dd className="text-right text-foreground">
                                  {inc.team}
                                </dd>
                              </div>

                              <div className="flex justify-between gap-2">
                                <dt className="text-muted-foreground">
                                  District
                                </dt>

                                <dd className="text-right text-foreground">
                                  {inc.district}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        ) : null}

                        <Button
                          variant={open ? 'secondary' : 'outline'}
                          size="sm"
                          className="w-full"
                          onClick={() =>
                            setOpenId(open ? null : inc.id)
                          }
                        >
                          {open
                            ? 'Hide reasoning'
                            : 'Why this rank?'}
                        </Button>
                      </article>
                    )
                  })
                )}
              </div>
            </section>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardDescription className="font-mono text-[10px] tracking-[0.16em] uppercase">
            {t('section.priorityFormula')}
          </CardDescription>

          <CardTitle className="text-base">
            How the queue ranks itself
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-4">
          {[
            {
              label: 'Hazard risk score',
              weight: 40,
              note: 'Fused model output for the cell',
            },
            {
              label: 'Population exposure',
              weight: 30,
              note: 'Residents inside modelled runout',
            },
            {
              label: 'Access criticality',
              weight: 20,
              note: 'Sole-access and hospital reachability',
            },
            {
              label: 'Time decay',
              weight: 10,
              note: 'Unattended incidents escalate',
            },
          ].map((f) => (
            <div
              key={f.label}
              className="flex flex-col gap-1.5"
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs font-medium">
                  {f.label}
                </p>

                <span className="font-mono text-xs tabular-nums text-primary">
                  {f.weight}%
                </span>
              </div>

              <Progress
                value={f.weight}
                className="h-1.5"
              />

              <p className="text-[11px] leading-relaxed text-muted-foreground">
                {f.note}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}