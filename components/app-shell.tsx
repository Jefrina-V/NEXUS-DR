'use client'

import {
  ActivityIcon,
  BellRingIcon,
  CloudRainIcon,
  DatabaseIcon,
  LayersIcon,
  MapIcon,
  MenuIcon,
  RadioIcon,
  RouteIcon,
  SirenIcon,
  SmartphoneIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { useLanguage } from '@/components/language-provider'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const nav = [
  {
    groupKey: 'nav.group.situation',
    items: [
      { href: '/', labelKey: 'nav.command', icon: MapIcon, hint: 'GIS' },
      { href: '/risk-engine', labelKey: 'nav.riskEngine', icon: ActivityIcon, hint: 'XAI' },
      { href: '/forecast', labelKey: 'nav.forecast', icon: CloudRainIcon, hint: 'IMD' },
    ],
  },
  {
    groupKey: 'nav.group.act',
    items: [
      { href: '/roads', labelKey: 'nav.roads', icon: RouteIcon, hint: 'Predict' },
      { href: '/response', labelKey: 'nav.response', icon: SirenIcon, hint: 'Triage' },
      { href: '/alerts', labelKey: 'nav.alerts', icon: BellRingIcon, hint: '4 ch' },
    ],
  },
  {
    groupKey: 'nav.group.reach',
    items: [
      { href: '/field', labelKey: 'nav.field', icon: SmartphoneIcon, hint: 'Sync' },
      { href: '/platform', labelKey: 'nav.platform', icon: DatabaseIcon, hint: '8 feeds' },
    ],
  },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { t } = useLanguage()
  return (
    <nav className="flex flex-col gap-6" aria-label="Main">
      {nav.map((section) => (
        <div key={section.groupKey} className="flex flex-col gap-1">
          <p className="px-3 pb-1 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
            {t(section.groupKey)}
          </p>
          {section.items.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  active
                    ? 'bg-primary/12 text-foreground shadow-[inset_2px_0_0_0_var(--primary)]'
                    : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                )}
              >
                <item.icon className={cn('size-4 shrink-0', active ? 'text-primary' : 'text-muted-foreground')} />
                <span className="flex-1 truncate">{t(item.labelKey)}</span>
                <span className="font-mono text-[10px] text-muted-foreground/70">{item.hint}</span>
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex size-9 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
        <LayersIcon className="size-4.5 text-primary" />
      </div>
      <div className="leading-tight">
        <p className="font-mono text-sm font-semibold tracking-[0.14em]">NEXUS-DR</p>
        <p className="text-[11px] text-muted-foreground">Landslide EWS · NER</p>
      </div>
    </div>
  )
}

function SystemFooter() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card/60 p-3">
      <div className="flex items-center gap-2">
        <span className="relative flex size-2">
          <span className="pulse-ring absolute inset-0 rounded-full text-risk-low" />
          <span className="size-2 rounded-full bg-risk-low" />
        </span>
        <p className="text-xs text-foreground">Ingest pipeline live</p>
      </div>
      <dl className="grid grid-cols-2 gap-y-1.5 font-mono text-[10px] text-muted-foreground">
        <dt>Last fusion</dt>
        <dd className="text-right text-foreground">42 s ago</dd>
        <dt>Districts</dt>
        <dd className="text-right text-foreground">12 / 12</dd>
      </dl>
    </div>
  )
}

function Clock() {
  const [now, setNow] = React.useState<Date | null>(null)
  React.useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="font-mono text-xs text-muted-foreground tabular-nums">
      {now
        ? `${now.toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' })} IST`
        : '--:--:-- IST'}
    </span>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col justify-between gap-6 border-r border-border bg-sidebar p-4 lg:flex">
        <div className="flex flex-col gap-7">
          <Brand />
          <NavLinks />
        </div>
        <SystemFooter />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                  <MenuIcon />
                </Button>
              }
            />
            <SheetContent side="left" className="w-72 p-4">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SheetDescription className="sr-only">NEXUS-DR modules</SheetDescription>
              <div className="flex h-full flex-col justify-between gap-6">
                <div className="flex flex-col gap-7">
                  <Brand />
                  <NavLinks onNavigate={() => setOpen(false)} />
                </div>
                <SystemFooter />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2 lg:hidden">
            <LayersIcon className="size-4 text-primary" />
            <span className="font-mono text-sm font-semibold tracking-[0.14em]">NEXUS-DR</span>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Badge variant="outline" className="hidden gap-1.5 border-risk-severe/40 bg-risk-severe/12 text-risk-severe sm:inline-flex">
              <RadioIcon />2 severe districts
            </Badge>
            <LanguageSwitcher />
            <Clock />
          </div>
        </header>

        <main className="px-4 pt-5 pb-14 sm:px-6">{children}</main>
      </div>
    </div>
  )
}
