'use client'

import { CheckCircle2Icon, LanguagesIcon, RadioTowerIcon, SendIcon } from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'
import { useLanguage } from '@/components/language-provider'
import { PageHeader } from '@/components/page-header'
import { StatTile } from '@/components/risk-bits'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { alertLog, bandMeta, channelStats, districts, languages, roads } from '@/lib/nexus-data'
import { cn } from '@/lib/utils'

const templates: Record<string, { en: string; local: string }> = {
  evacuate: {
    en: 'LANDSLIDE WARNING: Leave your house now and move to {shelter}. Do not use {road}. Help line 1077.',
    local: 'भूस्खलन चेतावनी: घर तुरंत छोड़ें और {shelter} जाएँ। {road} का उपयोग न करें। सहायता 1077।',
  },
  avoid: {
    en: 'ROAD ALERT: {road} is blocked by a landslide. Use the published detour. Expected restoration in {eta}.',
    local: 'सड़क चेतावनी: {road} भूस्खलन से अवरुद्ध है। वैकल्पिक मार्ग लें। बहाली {eta} में।',
  },
  watch: {
    en: 'HEAVY RAIN WATCH for {district}. Avoid slopes and hill cuttings for the next 24 hours. Stay tuned.',
    local: '{district} में भारी बारिश की निगरानी। अगले 24 घंटे ढलानों से दूर रहें।',
  },
}

export default function AlertsPage() {
  const { t } = useLanguage()
  const [district, setDistrict] = React.useState(districts[0].id)
  const [template, setTemplate] = React.useState('evacuate')
  const [channels, setChannels] = React.useState<Record<string, boolean>>({
    'Cell Broadcast': true,
    SMS: true,
    'Mobile App': true,
    'Voice IVR': false,
  })

  const selected = districts.find((d) => d.id === district) ?? districts[0]
  const activeChannels = Object.entries(channels).filter(([, on]) => on)
  const estimatedReach = Math.round(
    activeChannels.reduce((sum, [name]) => {
      const stat = channelStats.find((c) => c.channel === name)
      return sum + (stat ? (stat.reach / 100) * selected.population : 0)
    }, 0) / Math.max(activeChannels.length, 1),
  )

  const lifeline = roads.find((r) => r.district === selected.name)?.name ?? 'affected hill roads'

  const body = templates[template]
  const filled = (text: string) =>
    text
      .replace('{shelter}', `the ${selected.name} relief shelter`)
      .replace('{road}', lifeline)
      .replace('{district}', selected.name)
      .replace('{eta}', '36 hours')

  return (
    <div className="flex flex-col gap-6 py-1">
      <PageHeader
        eyebrow={t('page.alerts.eyebrow')}
        title={t('page.alerts.title')}
        actions={
          <Badge variant="outline" className="gap-1.5 border-risk-severe/40 bg-risk-severe/12 text-risk-severe">
            <RadioTowerIcon />1 dispatch in progress
          </Badge>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Alerts issued today" value="14" note="4 severe, 6 high, 4 advisory" />
        <StatTile label="Delivery rate" value="96.2%" note="Weighted across all channels" accent="low" />
        <StatTile label="Languages live" value="12" note="Including Dimasa, Lepcha, Rongmei" accent="signal" />
        <StatTile label="Median time to reach" value="11 s" note="Cell broadcast reaches in 4 s" accent="signal" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <CardDescription className="font-mono text-[10px] tracking-[0.16em] uppercase">{t('section.composer')}</CardDescription>
            <CardTitle className="text-base">Build a multilingual alert</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="district">Target district</FieldLabel>
                  <Select value={district} onValueChange={(v) => setDistrict(v as string)}>
                    <SelectTrigger id="district">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {districts.map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.name} · risk {d.score}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="template">Message template</FieldLabel>
                  <Select value={template} onValueChange={(v) => setTemplate(v as string)}>
                    <SelectTrigger id="template">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="evacuate">Evacuate now (severe)</SelectItem>
                        <SelectItem value="avoid">Road blocked / detour</SelectItem>
                        <SelectItem value="watch">Heavy rain watch</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </FieldGroup>

            <div className="flex flex-col gap-2">
              <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Channels</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {channelStats.map((c) => (
                  <label
                    key={c.channel}
                    className={cn(
                      'flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3 transition-colors',
                      channels[c.channel] ? 'border-primary/40 bg-primary/[0.06]' : 'border-border bg-card',
                    )}
                  >
                    <span className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium">{c.channel}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {c.reach}% reach · {c.latency}
                      </span>
                    </span>
                    <Switch
                      checked={channels[c.channel]}
                      onCheckedChange={(on) => setChannels((prev) => ({ ...prev, [c.channel]: Boolean(on) }))}
                      aria-label={c.channel}
                    />
                  </label>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <LanguagesIcon className="size-3.5 text-signal" />
                <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                  Preview · auto-translated
                </p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs leading-relaxed">
                <p className="text-foreground">{filled(body.en)}</p>
                <Separator />
                <p className="text-muted-foreground">{filled(body.local)}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {languages.slice(0, 8).map((l) => (
                  <Badge key={l} variant="secondary" className="font-mono text-[10px]">
                    {l}
                  </Badge>
                ))}
                <Badge variant="outline" className="font-mono text-[10px]">
                  +4 more
                </Badge>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-0.5">
                <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                  Estimated reach
                </p>
                <p className="font-mono text-xl font-semibold tabular-nums text-primary">
                  {estimatedReach.toLocaleString('en-IN')}
                </p>
              </div>
              <Button
                disabled={activeChannels.length === 0}
                onClick={() =>
                  toast.success(`Alert queued for ${selected.name}`, {
                    description: `${activeChannels.length} channels · ~${estimatedReach.toLocaleString('en-IN')} people`,
                  })
                }
              >
                <SendIcon data-icon="inline-start" />
                Dispatch alert
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardDescription className="font-mono text-[10px] tracking-[0.16em] uppercase">
              {t('section.dispatchLog')}
            </CardDescription>
            <CardTitle className="text-base">Recent alerts</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {alertLog.map((a) => {
              const meta = bandMeta[a.band]
              const pct = Math.round((a.delivered / a.reach) * 100)
              return (
                <article key={a.id} className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {a.id} · {a.issued}
                    </span>
                    <Badge variant="outline" className={cn('gap-1.5', meta.bg, meta.border, meta.text)}>
                      {a.status === 'sending' ? 'Sending' : 'Delivered'}
                    </Badge>
                  </div>
                  <p className="text-xs leading-relaxed text-pretty">{a.headline}</p>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-muted-foreground">{a.district}</span>
                      <span className="tabular-nums text-foreground">
                        {a.delivered.toLocaleString('en-IN')} / {a.reach.toLocaleString('en-IN')} · {pct}%
                      </span>
                    </div>
                    <Progress value={pct} className="h-1" />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {a.channels.map((c) => (
                      <span
                        key={c}
                        className="rounded border border-border px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </article>
              )
            })}
            <div className="flex items-center gap-2 rounded-lg border border-risk-low/30 bg-risk-low/[0.08] p-3">
              <CheckCircle2Icon className="size-4 shrink-0 text-risk-low" />
              <p className="text-[11px] leading-relaxed">
                All dispatches are logged immutably with issuing officer, channel and delivery receipts for post-event
                audit.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
