'use client'

import dynamic from 'next/dynamic'

const InteractiveClusterMapInternal = dynamic(
  () => import('@/components/interactive-cluster-map'),
  { ssr: false }
)

export default function ClientClusterMap() {
  return <InteractiveClusterMapInternal />
}
