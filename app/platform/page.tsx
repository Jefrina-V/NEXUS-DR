'use client'

import { CircleDotIcon, DatabaseIcon, ShieldCheckIcon } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { PageHeader } from '@/components/page-header'
import { StatTile } from '@/components/risk-bits'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { dataSources, impactStats, modelCard } from '@/lib/nexus-data'
import { cn } from '@/lib/utils'

const pipeline = [
  { stage: 'Ingest', detail: 'IMD, ISRO, IoT, GSI, census — 8 feeds normalised to a common district-cell grid.' },
  { stage: 'Fuse', detail: 'Terrain + rainfall + sensor + deformation features joined per 1 km cell every 15 minutes.' },
  { stage: 'Infer', detail: 'Weighted ensemble emits a 0–100 risk score with SHAP attributions per cell.' },
  { stage: 'Decide', detail: 'Thresholds map score to band, band drives triage rank and alert templates.' },
  { stage: 'Deliver', detail: 'Cell broadcast, SMS, IVR and app dispatch with per-channel delivery receipts.' },
]

export default function PlatformPage() {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col gap-6 py-1">
      <PageHeader
        eyebrow={t('page.platform.eyebrow')}
        title={t('page.platform.title')}
        actions={
          <Badge variant="outline" className="gap-1.5 border-risk-low/40 bg-risk-low/12 text-risk-low">
            <ShieldCheckIcon />
            All feeds government-sourced
          </Badge>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {impactStats.map((s) => (
          <StatTile key={s.label} label={s.label} value={s.value} note={s.note} accent="signal" />
        ))}
      </div>

      <Tabs defaultValue="sources">
        <TabsList>
          <TabsTrigger value="sources">Data sources</TabsTrigger>
          <TabsTrigger value="model">Model card</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="pt-4">
          <Card>
            <CardHeader>
              <CardDescription className="font-mono text-[10px] tracking-[0.16em] uppercase">
                {t('section.eightLiveFeeds')}
              </CardDescription>
              <CardTitle className="text-base">Everything is a real, obtainable Indian data source</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Cadence</TableHead>
                      <TableHead>What it contributes</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataSources.map((s) => (
                      <TableRow key={s.name}>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{s.kind}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{s.cadence}</TableCell>
                        <TableCell className="max-w-xs text-xs text-muted-foreground text-pretty">{s.detail}</TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant="outline"
                            className={cn(
                              'gap-1.5',
                              s.status === 'live'
                                ? 'border-risk-low/40 bg-risk-low/12 text-risk-low'
                                : 'border-risk-moderate/40 bg-risk-moderate/12 text-risk-moderate',
                            )}
                          >
                            <CircleDotIcon />
                            {s.status === 'live' ? 'Live' : 'Degraded'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="model" className="pt-4">
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <Card>
              <CardHeader>
                <CardDescription className="font-mono text-[10px] tracking-[0.16em] uppercase">
                  {t('section.ensembleComposition')}
                </CardDescription>
                <CardTitle className="text-base">Four models, one auditable score</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {modelCard.ensemble.map((m) => (
                  <div key={m.name} className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-medium">{m.name}</p>
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">
                        weight {m.weight}% · AUC {m.auc}
                      </span>
                    </div>
                    <Progress value={m.weight * 2.5} className="h-1.5" />
                    <p className="text-[11px] leading-relaxed text-muted-foreground">{m.note}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="h-fit">
              <CardHeader>
                <CardDescription className="font-mono text-[10px] tracking-[0.16em] uppercase">
                  {t('section.validation')}
                </CardDescription>
                <CardTitle className="text-base">Measured on GSI inventory</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {modelCard.metrics.map((m) => (
                  <div key={m.label} className="flex items-baseline justify-between gap-3">
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                    <p className="font-mono text-sm font-semibold tabular-nums text-primary">{m.value}</p>
                  </div>
                ))}
                <Separator />
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Backtested on 11,400 catalogued North-East failures with spatial cross-validation, so scores are not
                  inflated by testing on neighbouring cells of the same event.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="pt-4">
          <Card>
            <CardHeader>
              <CardDescription className="font-mono text-[10px] tracking-[0.16em] uppercase">
                {t('section.ingestToAlert')}
              </CardDescription>
              <CardTitle className="text-base">A 15-minute loop from satellite to siren</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="flex flex-col gap-0 lg:flex-row">
                {pipeline.map((p, i) => (
                  <li key={p.stage} className="flex flex-1 gap-3 lg:flex-col">
                    <div className="flex flex-col items-center lg:w-full lg:flex-row">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/12 font-mono text-xs text-primary">
                        {i + 1}
                      </span>
                      <span
                        className={cn(
                          'bg-border',
                          i === pipeline.length - 1 ? 'hidden' : 'w-px flex-1 lg:h-px lg:w-full',
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-1 pb-6 lg:pr-6 lg:pb-0">
                      <p className="font-mono text-xs tracking-[0.12em] text-foreground uppercase">{p.stage}</p>
                      <p className="text-[11px] leading-relaxed text-muted-foreground text-pretty">{p.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Separator className="my-5" />
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { k: 'Tech stack', v: 'Next.js dashboard, Python inference, PostGIS + TimescaleDB, MQTT sensor bus' },
                  { k: 'Deployment', v: 'District-tenant model — add a district by loading its DEM, gauges and registry' },
                  { k: 'Cost profile', v: 'Runs on existing NIC/state cloud; no proprietary satellite subscription' },
                ].map((x) => (
                  <div key={x.k} className="flex gap-2.5 rounded-lg border border-border bg-muted/30 p-3">
                    <DatabaseIcon className="mt-0.5 size-4 shrink-0 text-signal" />
                    <div className="flex flex-col gap-0.5">
                      <p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">{x.k}</p>
                      <p className="text-[11px] leading-relaxed">{x.v}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
