'use client'

import dynamic from 'next/dynamic'

const RoutePlannerViewInternal = dynamic(
  () => import('@/components/route-planner-view'),
  { ssr: false }
)

export default function ClientRoutePlanner() {
  return <RoutePlannerViewInternal />
}
