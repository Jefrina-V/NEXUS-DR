import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react'
import { bandMeta, bandOf } from '@/lib/nexus-data'
import { cn } from '@/lib/utils'

export function RiskBadge({ score, className }: { score: number; className?: string }) {
  const meta = bandMeta[bandOf(score)]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[11px]',
        meta.bg,
        meta.border,
        meta.text,
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', meta.dot)} />
      {meta.label} {score}
    </span>
  )
}

export function Delta({ value }: { value: number }) {
  const up = value >= 0
  const Icon = up ? TrendingUpIcon : TrendingDownIcon
  return (
    <span
      className={cn('inline-flex items-center gap-1 font-mono text-[11px]', up ? 'text-risk-high' : 'text-risk-low')}
    >
      <Icon className="size-3" />
      {up ? '+' : ''}
      {value} / 24h
    </span>
  )
}

export function ScoreDial({ score, size = 132 }: { score: number; size?: number }) {
  const meta = bandMeta[bandOf(score)]
  const stroke = 9
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = (score / 100) * c

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`Risk score ${score} of 100`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--muted)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={meta.cssVar}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-3xl font-semibold tabular-nums" style={{ color: meta.cssVar }}>
          {score}
        </span>
        <span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">{meta.label}</span>
      </div>
    </div>
  )
}

export function RiskLegend({ className }: { className?: string }) {
  const bands = [
    { label: 'Low 0–49', key: 'low' as const },
    { label: 'Watch 50–69', key: 'moderate' as const },
    { label: 'Alert 70–84', key: 'high' as const },
    { label: 'Severe 85–100', key: 'severe' as const },
  ]
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-4 gap-y-2', className)}>
      {bands.map((b) => (
        <li key={b.key} className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
          <span className={cn('size-2 rounded-full', bandMeta[b.key].dot)} />
          {b.label}
        </li>
      ))}
    </ul>
  )
}

export function StatTile({
  label,
  value,
  note,
  accent,
}: {
  label: string
  value: string
  note?: string
  accent?: 'primary' | 'severe' | 'low' | 'signal'
}) {
  const color =
    accent === 'severe'
      ? 'text-risk-severe'
      : accent === 'low'
        ? 'text-risk-low'
        : accent === 'signal'
          ? 'text-signal'
          : 'text-primary'
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4">
      <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">{label}</p>
      <p className={cn('font-mono text-2xl font-semibold tabular-nums', color)}>{value}</p>
      {note ? <p className="text-[11px] leading-relaxed text-muted-foreground">{note}</p> : null}
    </div>
  )
}
