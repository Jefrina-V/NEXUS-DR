'use client'

import {
  AlertTriangleIcon,
  CameraIcon,
  CloudOffIcon,
  MapPinIcon,
  RefreshCwIcon,
  SignalIcon,
  SignalZeroIcon,
  UploadCloudIcon,
  XIcon,
} from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'
import { useLanguage } from '@/components/language-provider'
import { PageHeader } from '@/components/page-header'
import { StatTile } from '@/components/risk-bits'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { fieldReports } from '@/lib/nexus-data'
import { cn } from '@/lib/utils'

const syncMeta = {
  synced: { label: 'Synced', cls: 'border-risk-low/40 bg-risk-low/12 text-risk-low' },
  queued: { label: 'Queued offline', cls: 'border-risk-moderate/40 bg-risk-moderate/12 text-risk-moderate' },
  conflict: { label: 'Needs review', cls: 'border-risk-high/40 bg-risk-high/12 text-risk-high' },
} as const

function PhoneMock({ online }: { online: boolean }) {
  const { t } = useLanguage()
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null)

  const handleCaptureClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })
    toast.success('Photo attached — queued with your report')
    e.target.value = ''
  }

  const clearPhoto = () => {
    setPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
  }

  React.useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mx-auto w-full max-w-[300px]">
      <div className="rounded-[2rem] border border-border bg-sidebar p-2 shadow-2xl">
        <div className="overflow-hidden rounded-[1.6rem] border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <span className="font-mono text-[10px] text-muted-foreground">09:41</span>
            <span className="flex items-center gap-1 font-mono text-[10px]">
              {online ? (
                <>
                  <SignalIcon className="size-3 text-risk-low" />
                  <span className="text-risk-low">2G</span>
                </>
              ) : (
                <>
                  <SignalZeroIcon className="size-3 text-risk-high" />
                  <span className="text-risk-high">No signal</span>
                </>
              )}
            </span>
          </div>

          <div className="flex flex-col gap-3 p-3">
            <div
              className={cn(
                'flex items-center gap-2 rounded-lg border p-2.5',
                online ? 'border-risk-low/35 bg-risk-low/10' : 'border-risk-moderate/35 bg-risk-moderate/10',
              )}
            >
              {online ? (
                <UploadCloudIcon className="size-4 shrink-0 text-risk-low" />
              ) : (
                <CloudOffIcon className="size-4 shrink-0 text-risk-moderate" />
              )}
              <p className="text-[11px] leading-snug">
                {online ? 'Syncing 2 queued reports…' : 'Offline mode — reports saved on device'}
              </p>
            </div>

            <div className="rounded-lg border border-risk-severe/35 bg-risk-severe/10 p-2.5">
              <p className="font-mono text-[9px] tracking-[0.14em] text-risk-severe uppercase">Your area</p>
              <p className="mt-1 text-sm leading-snug font-semibold text-risk-severe">Severe — evacuate now</p>
              <p className="mt-1 text-[11px] leading-relaxed text-foreground">
                Move to Mahur Govt. School shelter. Do not use NH-27.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
                Cached offline map
              </p>
              <div className="relative h-24 overflow-hidden rounded-lg border border-border bg-muted">
                <div className="grid-overlay absolute inset-0" />
                <div className="absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-4 ring-primary/25" />
                <span className="absolute right-1.5 bottom-1.5 rounded bg-background/80 px-1 font-mono text-[8px] text-muted-foreground">
                  tiles cached 6 h ago
                </span>
              </div>
            </div>

            {photoPreview ? (
              <div className="relative overflow-hidden rounded-lg border border-border">
                <img src={photoPreview} alt="Captured crack or slide" className="h-28 w-full object-cover" />
                <button
                  type="button"
                  onClick={clearPhoto}
                  aria-label="Remove photo"
                  className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-background/80 text-foreground"
                >
                  <XIcon className="size-3" />
                </button>
                <span className="absolute bottom-1.5 left-1.5 rounded bg-background/80 px-1.5 py-0.5 font-mono text-[9px] text-risk-low">
                  Photo attached
                </span>
              </div>
            ) : null}

            <div className="flex flex-col gap-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button size="sm" className="w-full" onClick={handleCaptureClick}>
                <CameraIcon data-icon="inline-start" />
                {t('btn.reportCrack')}
              </Button>
              <Button size="sm" variant="outline" className="w-full">
                <MapPinIcon data-icon="inline-start" />
                Nearest shelter · 1.4 km
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FieldPage() {
  const { t } = useLanguage()
  const [online, setOnline] = React.useState(false)

  const queued = fieldReports.filter((r) => r.sync !== 'synced').length

  return (
    <div className="flex flex-col gap-6 py-1">
      <PageHeader
        eyebrow={t('page.field.eyebrow')}
        title={t('page.field.title')}
        description="Hill districts lose connectivity exactly when a disaster starts. The field app works fully offline: cached tiles, on-device queues, and GPS-tagged reports that sync the moment any 2G sliver returns."
        actions={
          <Button variant="outline" size="sm" onClick={() => toast.success('4 reports pushed to the fusion engine')}>
            <RefreshCwIcon data-icon="inline-start" />
            {t('btn.forceSync')}
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Registered observers" value="1,842" note="ASHA workers, police, volunteers" />
        <StatTile label="Reports this week" value="271" note="93% with photo evidence" accent="signal" />
        <StatTile label="Queued offline now" value={String(queued)} note="Will sync automatically" accent="severe" />
        <StatTile label="Offline map coverage" value="100%" note="All 12 districts pre-cached" accent="low" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardHeader>
            <CardDescription className="font-mono text-[10px] tracking-[0.16em] uppercase">
              {t('section.liveSimulation')}
            </CardDescription>
            <CardTitle className="text-base">Citizen handset</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <PhoneMock online={online} />
            <label className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
              <span className="flex flex-col gap-0.5">
                <span className="text-xs font-medium">Network available</span>
                <span className="text-[11px] text-muted-foreground">Toggle to see offline behaviour</span>
              </span>
              <Switch checked={online} onCheckedChange={(v) => setOnline(Boolean(v))} aria-label="Network available" />
            </label>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardDescription className="font-mono text-[10px] tracking-[0.16em] uppercase">
                {t('section.inboundStream')}
              </CardDescription>
              <CardTitle className="text-base">Field reports feeding the model</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {fieldReports.map((r) => {
                const meta = syncMeta[r.sync]
                return (
                  <article key={r.id} className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3.5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-medium">{r.observer}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">
                          {r.id} · {r.district} · {r.captured}
                        </p>
                      </div>
                      <Badge variant="outline" className={cn('gap-1.5', meta.cls)}>
                        {meta.label}
                      </Badge>
                    </div>
                    <p className="text-xs leading-relaxed text-pretty">{r.note}</p>
                    <Separator />
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="size-3" />
                        {r.gps}
                      </span>
                      <span className="flex items-center gap-1">
                        <CameraIcon className="size-3" />
                        {r.photos} photos
                      </span>
                    </div>
                  </article>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription className="font-mono text-[10px] tracking-[0.16em] uppercase">
                {t('section.resilienceDesign')}
              </CardDescription>
              <CardTitle className="text-base">How it survives a blackout</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  title: 'Pre-cached vector tiles',
                  body: 'District maps, shelters and evacuation routes are downloaded before monsoon onset.',
                },
                {
                  title: 'On-device write queue',
                  body: 'Reports and photos persist locally with timestamps and are replayed in order on reconnect.',
                },
                {
                  title: 'SMS fallback protocol',
                  body: 'If data never returns, a compressed report is sent as a single 140-char structured SMS.',
                },
                {
                  title: 'Conflict review, not overwrite',
                  body: 'Contradicting reports are flagged for a human instead of silently discarded.',
                },
              ].map((f) => (
                <div key={f.title} className="flex gap-2.5 rounded-lg border border-border bg-muted/30 p-3">
                  <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-signal" />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs font-medium">{f.title}</p>
                    <p className="text-[11px] leading-relaxed text-muted-foreground">{f.body}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
