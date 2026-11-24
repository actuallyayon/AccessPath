'use client'

import dynamic from 'next/dynamic'

const MiniMapInternal = dynamic(() => import('@/components/mini-map'), { ssr: false })

export default function ClientMiniMap(props: { lat: number; lng: number; name: string }) {
  return <MiniMapInternal {...props} />
}
