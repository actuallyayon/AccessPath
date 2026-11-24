import Link from 'next/link'
import {
  Navigation2,
  Search,
  AlertTriangle,
  ShieldCheck,
  Compass,
  Sparkles,
  ArrowRight,
  ChevronRight,
  MapPin,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  Heart,
  UserCheck,
  Eye,
  Sliders,
  Footprints,
  Baby,
  Quote
} from 'lucide-react'
import { LandingFaq } from '@/components/landing-faq'
import { ScrollReveal } from '@/components/scroll-reveal'
import { ScrollingTicker } from '@/components/scrolling-ticker'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-full overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        {/* Cinematic Backdrop Banner Image with Gradient Overlays */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2000&q=85"
            alt="Modern accessible urban cityscape banner"
            className="w-full h-full object-cover object-center scale-105 opacity-30 dark:opacity-25 filter saturate-125"
          />
          {/* Seamless gradient fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/90 to-neutral-50 dark:from-neutral-950/75 dark:via-neutral-950/90 dark:to-neutral-950" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-sky-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <ScrollReveal animation="fade-up" duration={600}>
            {/* Category / Sub-heading Tag without pill container */}
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-6">
              Inclusive Urban Navigation & Accessibility Mapping
            </p>

            {/* Clean Modern Display Typography */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-neutral-900 dark:text-white max-w-4xl mx-auto leading-[1.08]">
              Navigate your city by{' '}
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                accessibility
              </span>
              , not just distance.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Discover verified wheelchair-friendly venues, bypass damaged footpaths and broken elevators, and traverse safer routes with live crowdsourced intelligence.
            </p>

            {/* Call to Actions */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/explore"
                className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all hover:scale-102 hover:shadow-md hover:shadow-emerald-600/20"
              >
                <Search className="w-4 h-4" />
                <span>Explore Places</span>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </Link>

              <Link
                href="/route-planner"
                className="flex items-center gap-2 px-6 py-3.5 rounded-full glass hover:bg-white/80 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white font-semibold text-sm transition-all hover:scale-102"
              >
                <Navigation2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 rotate-45" />
                <span>Accessibility Route Planner</span>
              </Link>

              <Link
                href="/map"
                className="flex items-center gap-2 px-5 py-3.5 rounded-full glass hover:bg-white/80 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-sm transition-all hover:scale-102"
              >
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Map Clusters</span>
              </Link>
            </div>
          </ScrollReveal>

          {/* Stats Bar */}
          <ScrollReveal animation="scale-up" delay={200} duration={700}>
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-6 rounded-3xl glass shadow-lg">
              <div className="p-2 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">10,000+</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">Vetted Locations</p>
              </div>
              <div className="p-2 text-center border-l border-neutral-200/60 dark:border-neutral-800/60">
                <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">52,000+</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">Barriers Logged</p>
              </div>
              <div className="p-2 text-center border-l border-neutral-200/60 dark:border-neutral-800/60">
                <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">100,000+</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">Community Reviews</p>
              </div>
              <div className="p-2 text-center border-l border-neutral-200/60 dark:border-neutral-800/60">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">0 - 100</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">Accessibility Score</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* INFINITE SCROLLING TICKER */}
      <ScrollingTicker />

      {/* 2. MULTI-MOBILITY PROFILES SECTION */}
      <section className="py-20 border-t border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-100/30 dark:bg-neutral-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                Personalized Routing
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
                One size does not fit all in urban transit
              </h2>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                Tailor navigation penalties according to your exact physical requirements.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Profile 1: Wheelchairs */}
            <ScrollReveal animation="fade-up" delay={0}>
              <div className="p-6 rounded-3xl glass border border-neutral-200/60 dark:border-neutral-800/60 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                  <Navigation2 className="w-6 h-6 rotate-45" />
                </div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">Wheelchairs & Powerchairs</h3>
                <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Prioritizes curb cuts, level ground entries, certified ramps (&lt; 1:12), and elevator access while strictly penalizing flights of stairs.
                </p>
                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] font-semibold text-emerald-600">
                  <span>Zero-Stair Guarantee</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </ScrollReveal>

            {/* Profile 2: Low-Vision & Cane */}
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="p-6 rounded-3xl glass border border-neutral-200/60 dark:border-neutral-800/60 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">Cane & Low-Vision</h3>
                <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Highlights continuous tactile paving corridors, auditory pedestrian signals, high-contrast pathways, and clear overhead clearances.
                </p>
                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] font-semibold text-teal-600">
                  <span>Tactile Path Priority</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </ScrollReveal>

            {/* Profile 3: Seniors & Reduced Mobility */}
            <ScrollReveal animation="fade-up" delay={200}>
              <div className="p-6 rounded-3xl glass border border-neutral-200/60 dark:border-neutral-800/60 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
                  <Footprints className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">Seniors & Walking Aids</h3>
                <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Filters for frequent rest benches, handrails along slopes, minimal vertical elevation climb, and slip-resistant walking surfaces.
                </p>
                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] font-semibold text-blue-600">
                  <span>Gentle Grade Routes</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </ScrollReveal>

            {/* Profile 4: Strollers & Rolling Carts */}
            <ScrollReveal animation="fade-up" delay={300}>
              <div className="p-6 rounded-3xl glass border border-neutral-200/60 dark:border-neutral-800/60 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-4">
                  <Baby className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">Strollers & Heavy Wheeled</h3>
                <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Identifies wide entrance doors (&gt;85cm), functional public station elevators, rollable curbs, and smooth paved walkways.
                </p>
                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] font-semibold text-purple-600">
                  <span>Wide Doorways</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (3-STEP WALKTHROUGH) */}
      <section className="py-20 border-t border-neutral-200/60 dark:border-neutral-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                Simple & Seamless
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
                How AccessPath Works in 3 Steps
              </h2>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                From planning your journey to reaching your destination without surprises.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <ScrollReveal animation="fade-up" delay={0}>
              <div className="p-8 rounded-3xl glass relative border border-neutral-200/60 dark:border-neutral-800/60 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl font-black text-emerald-600/30 mb-4">01</div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Discover & Plan</h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Search verified hospitals, restaurants, transit hubs, and parks. Inspect door measurements, bathroom grab bars, and ramp slopes before you leave home.
                </p>
                <div className="mt-4">
                  <Link href="/explore" className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline">
                    <span>Browse 10,000+ places</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={150}>
              <div className="p-8 rounded-3xl glass relative border border-neutral-200/60 dark:border-neutral-800/60 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl font-black text-teal-600/30 mb-4">02</div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Calculate Barrier-Free Route</h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Our spatial engine computes turn-by-turn routes dynamically rerouting around reported broken lifts, construction pits, or steep curbs.
                </p>
                <div className="mt-4">
                  <Link href="/route-planner" className="text-xs font-bold text-teal-600 flex items-center gap-1 hover:underline">
                    <span>Launch route calculator</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={300}>
              <div className="p-8 rounded-3xl glass relative border border-neutral-200/60 dark:border-neutral-800/60 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl font-black text-blue-600/30 mb-4">03</div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Audit & Protect Your City</h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Notice an unmapped step or broken sidewalk? Snap a photo in 30 seconds. Community moderators review it to alert thousands of travelers.
                </p>
                <div className="mt-4">
                  <Link href="/submit-barrier" className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                    <span>Submit hazard report</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. THE 0-100 ACCESSIBILITY SCORE BREAKDOWN */}
      <section className="py-20 border-t border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-100/40 dark:bg-neutral-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                Transparent Methodology
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
                The 0–100 Accessibility Scoring Framework
              </h2>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                Clear, standardized assessment criteria replacing subjective star ratings.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScrollReveal animation="scale-up" delay={0}>
              <div className="p-6 rounded-3xl glass border border-emerald-500/30 bg-emerald-500/5 space-y-3 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500 text-white">Grade A</span>
                  <span className="font-extrabold text-emerald-600 text-lg">85 – 100</span>
                </div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">Fully Accessible</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Flawless step-free entry, gentle ramps (&lt; 1:12), automated sliding doors, ADA compliant restrooms, and audible tactile elevators.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="scale-up" delay={100}>
              <div className="p-6 rounded-3xl glass border border-teal-500/30 bg-teal-500/5 space-y-3 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-teal-500 text-white">Grade B</span>
                  <span className="font-extrabold text-teal-600 text-lg">65 – 84</span>
                </div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">Moderately Accessible</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Level entry with minor low threshold (&lt;2cm), wide doors, manual ramp, standard elevator cabin. Independent entry feasible for most.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="scale-up" delay={200}>
              <div className="p-6 rounded-3xl glass border border-amber-500/30 bg-amber-500/5 space-y-3 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-500 text-white">Grade C</span>
                  <span className="font-extrabold text-amber-600 text-lg">40 – 64</span>
                </div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">Partially Accessible</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Ground floor accessible only, steep ramp requiring companion assist, or narrow restroom doors. Call ahead recommended.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="scale-up" delay={300}>
              <div className="p-6 rounded-3xl glass border border-rose-500/30 bg-rose-500/5 space-y-3 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-rose-500 text-white">Grade D</span>
                  <span className="font-extrabold text-rose-600 text-lg">&lt; 40</span>
                </div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">Significant Barriers</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Flight of multiple steps with zero ramp alternative, narrow doors (&lt;75cm), or out-of-order lift. Impassable without physical lifting.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 5. REAL-TIME CROWDSOURCED HAZARDS SPOTLIGHT */}
      <section className="py-20 border-t border-neutral-200/60 dark:border-neutral-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2">
                  Live Community Feeds
                </p>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
                  Real-Time Urban Hazard Intelligence
                </h2>
              </div>
              <Link
                href="/submit-barrier"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700"
              >
                <span>Report a new hazard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScrollReveal animation="fade-up" delay={0}>
              <div className="p-6 rounded-3xl glass border border-neutral-200/60 dark:border-neutral-800/60 space-y-3 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600">Elevator Failure</span>
                  <span className="text-[10px] text-neutral-400">12 min ago</span>
                </div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Central Station East Lift</h3>
                <p className="text-xs text-neutral-500">Out of order for motor maintenance. AccessPath routes travelers to West ramp concourse.</p>
                <div className="pt-2 text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Reroute Active</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={100}>
              <div className="p-6 rounded-3xl glass border border-neutral-200/60 dark:border-neutral-800/60 space-y-3 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600">Sidewalk Dig</span>
                  <span className="text-[10px] text-neutral-400">45 min ago</span>
                </div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Mirpur Road Trench</h3>
                <p className="text-xs text-neutral-500">Open utility pipe installation blocking entire pedestrian lane. Use crosswalk on opposite side.</p>
                <div className="pt-2 text-[11px] font-semibold text-amber-600 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Caution Advised</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <div className="p-6 rounded-3xl glass border border-neutral-200/60 dark:border-neutral-800/60 space-y-3 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600">Ramp Installed</span>
                  <span className="text-[10px] text-neutral-400">2 hours ago</span>
                </div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">City Library South Gate</h3>
                <p className="text-xs text-neutral-500">New modular steel ramp with handrails completed. Score upgraded from 52 to 89.</p>
                <div className="pt-2 text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified by Scout</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={300}>
              <div className="p-6 rounded-3xl glass border border-neutral-200/60 dark:border-neutral-800/60 space-y-3 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600">Tactile Paving</span>
                  <span className="text-[10px] text-neutral-400">3 hours ago</span>
                </div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">University Medical Entrance</h3>
                <p className="text-xs text-neutral-500">Tactile yellow guide strip repaired connecting directly from bus drop-off to reception lobby.</p>
                <div className="pt-2 text-[11px] font-semibold text-purple-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Audited</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 6. COMMUNITY TESTIMONIALS */}
      <section className="py-20 border-t border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-100/30 dark:bg-neutral-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                Community Voices
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
                Real Impact in Daily Urban Lives
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScrollReveal animation="fade-up" delay={0}>
              <div className="p-8 rounded-3xl glass border border-neutral-200/60 dark:border-neutral-800/60 space-y-4 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between">
                <div>
                  <Quote className="w-8 h-8 text-emerald-600/40 mb-3" />
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
                    &ldquo;Before AccessPath, visiting a new restaurant meant calling ahead and hoping the staff knew what a step-free entrance actually means. Now I check the photos and score in seconds.&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <p className="font-bold text-sm text-neutral-900 dark:text-white">Farhana Akhtar</p>
                  <p className="text-xs text-neutral-500">Powerchair User & Teacher, Dhaka</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={150}>
              <div className="p-8 rounded-3xl glass border border-neutral-200/60 dark:border-neutral-800/60 space-y-4 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between">
                <div>
                  <Quote className="w-8 h-8 text-teal-600/40 mb-3" />
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
                    &ldquo;Pushing a double stroller through busy urban intersections used to mean risking roadside traffic due to broken pavements. The route planner gives us safe, smooth rollable paths.&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <p className="font-bold text-sm text-neutral-900 dark:text-white">Tanvir Chowdhury</p>
                  <p className="text-xs text-neutral-500">Parent of two, Khulna</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={300}>
              <div className="p-8 rounded-3xl glass border border-neutral-200/60 dark:border-neutral-800/60 space-y-4 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between">
                <div>
                  <Quote className="w-8 h-8 text-blue-600/40 mb-3" />
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
                    &ldquo;Our civic advocacy group uses AccessPath&apos;s open PostGIS barrier density data to present municipal repair budgets directly to the city corporation with photographic proof.&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <p className="font-bold text-sm text-neutral-900 dark:text-white">Dr. Mahbubur Rahman</p>
                  <p className="text-xs text-neutral-500">Urban Planning Researcher</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 border-t border-neutral-200/60 dark:border-neutral-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                Common Questions
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                Everything you need to know about AccessPath&apos;s technology and data standards.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={150}>
            <LandingFaq />
          </ScrollReveal>
        </div>
      </section>

      {/* 8. CALL TO ACTION BANNER */}
      <section className="py-20 border-t border-neutral-200/60 dark:border-neutral-800/60 bg-gradient-to-b from-emerald-500/5 to-teal-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <ScrollReveal animation="scale-up">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 dark:text-white">
              Ready to make your city barrier-free?
            </h2>
            <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed mt-4">
              Join thousands of daily scouts, wheelchair navigators, and civic volunteers mapping accessible paths across our cities.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
              <Link
                href="/explore"
                className="px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all hover:scale-102 hover:shadow-lg"
              >
                Explore Accessible Directory
              </Link>
              <Link
                href="/submit-barrier"
                className="px-7 py-3.5 rounded-full glass hover:bg-white/80 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white font-bold text-sm transition-all hover:scale-102"
              >
                Report a Sidewalk Hazard
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
