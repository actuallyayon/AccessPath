'use client'

import { useEffect, useState } from 'react'

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function handleScroll() {
      const totalScroll = document.documentElement.scrollTop
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight
      if (windowHeight === 0) return
      const scrollPercent = Math.min(100, Math.max(0, (totalScroll / windowHeight) * 100))
      setProgress(scrollPercent)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-[2.5px] z-[100] pointer-events-none bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 transition-[width] duration-150 ease-out shadow-sm shadow-emerald-500/50"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
