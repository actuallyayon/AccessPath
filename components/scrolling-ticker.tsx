'use client'

import { 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Navigation2, 
  ShieldCheck, 
  Sparkles,
  Layers,
  Heart
} from 'lucide-react'

const TICKER_ITEMS = [
  {
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    tag: 'Ramp Verified',
    text: 'City Central Library: Grade-A Modular Ramp active (+30 pts)',
  },
  {
    icon: AlertTriangle,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10 border-rose-500/20',
    tag: 'Reroute Active',
    text: 'Subway East Concourse: Elevator repair in progress — use West Lift',
  },
  {
    icon: ShieldCheck,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10 border-blue-500/20',
    tag: 'Moderation',
    text: 'Dhaka Metropolitan: 142 new sidewalk audits approved today',
  },
  {
    icon: Navigation2,
    color: 'text-teal-500',
    bg: 'bg-teal-500/10 border-teal-500/20',
    tag: 'Route Engine',
    text: 'Wheelchair Cost Penalty Engine: 99.8% step-free routing accuracy',
  },
  {
    icon: MapPin,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10 border-purple-500/20',
    tag: 'Active Pilot',
    text: 'Khulna Pilot Zone: 1,400+ wheelchair-tested locations mapped',
  },
  {
    icon: Sparkles,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10 border-amber-500/20',
    tag: 'Community',
    text: 'Scout #4821 awarded Gold Contributor badge for tactile path audit',
  },
]

export function ScrollingTicker() {
  return (
    <div className="relative w-full overflow-hidden py-4 border-y border-neutral-200/60 dark:border-neutral-800/60 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md">
      {/* Side gradient fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-r from-neutral-50 dark:from-neutral-950 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-neutral-50 dark:from-neutral-950 to-transparent" />

      {/* Marquee Track */}
      <div className="animate-marquee flex items-center gap-6">
        {/* First repetition */}
        {TICKER_ITEMS.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={`a-${idx}`}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border border-neutral-200/70 dark:border-neutral-800/70 text-xs shadow-xs shrink-0"
            >
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-bold text-[10px] border ${item.bg} ${item.color}`}>
                <Icon className="w-3 h-3" />
                <span>{item.tag}</span>
              </span>
              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                {item.text}
              </span>
            </div>
          )
        })}

        {/* Second repetition for infinite seamless loop */}
        {TICKER_ITEMS.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={`b-${idx}`}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border border-neutral-200/70 dark:border-neutral-800/70 text-xs shadow-xs shrink-0"
            >
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-bold text-[10px] border ${item.bg} ${item.color}`}>
                <Icon className="w-3 h-3" />
                <span>{item.tag}</span>
              </span>
              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                {item.text}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
