'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

const FAQS = [
  {
    q: 'How does the 0–100 Accessibility Scoring algorithm work?',
    a: 'Every venue is assessed against five international accessibility dimensions: step-free entrance and ramps (up to 30 pts), internal circulation and ADA restrooms (up to 25 pts), elevator cabin dimensions and voice alerts (up to 25 pts), sensory aids like tactile paving and braille signage (up to 20 pts), minus live crowd-verified active hazard penalties.'
  },
  {
    q: 'How quickly are crowdsourced barrier reports factored into the Route Planner?',
    a: 'Immediately upon submission, critical safety hazards (such as broken elevators or deep sidewalk trenches) flag active detours in real-time. Regional community moderators then verify photo evidence and GPS accuracy to permanently calibrate the route cost engine.'
  },
  {
    q: 'Is AccessPath completely free to use?',
    a: 'Yes, 100% free and open for public good. All pedestrians, accessibility scouts, and researchers can search places, plan wheelchair routes, and report hazards without paywalls or tracking advertisements.'
  },
  {
    q: 'Can I audit and add my local business or neighborhood venues?',
    a: 'Absolutely! Create an account or sign in to submit a new location or review an existing venue. You can upload photos of entrance slopes, measure door widths, and note accessible bathroom amenities to earn contributor scouting badges.'
  },
  {
    q: 'How do city planners and transit agencies use AccessPath data?',
    a: 'AccessPath stores all audits in an open PostGIS spatial database. Municipal teams can view geospatial hazard clusters to identify high-priority sidewalk repairs, missing curb ramps, and transit hub elevator maintenance needs.'
  }
]

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx
        return (
          <div
            key={idx}
            className="rounded-2xl glass border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-neutral-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="text-sm sm:text-base">{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 shrink-0 transition-transform duration-200 text-neutral-400 ${
                  isOpen ? 'rotate-180 text-emerald-600' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/50 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
