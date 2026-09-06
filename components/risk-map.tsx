'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import type { RiskMapProps } from '@/components/risk-map-inner'

const RiskMapInner = dynamic(() => import('@/components/risk-map-inner'), {
  ssr: false,
  loading: () => (
    <div className="flex size-full items-center justify-center bg-muted/30">
      <div className="flex w-full flex-col gap-3 p-6">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-full min-h-40 w-full" />
      </div>
    </div>
  ),
})

export function RiskMap(props: RiskMapProps) {
  return <RiskMapInner {...props} />
}
