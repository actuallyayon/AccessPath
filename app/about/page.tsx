import Link from 'next/link'
import { 
  ShieldCheck, 
  Heart, 
  MapPin, 
  Navigation2, 
  AlertTriangle, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Target,
  Layers,
  Award,
  Globe2
} from 'lucide-react'

export const metadata = {
  title: 'About AccessPath | Our Mission & Universal Urban Mobility',
  description: 'Learn why AccessPath was built, how our spatial crowdsourcing works, and how our 0-100 Accessibility Scoring algorithm empowers independent movement.',
}

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden border-b border-neutral-200/60 dark:border-neutral-800/60">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-sky-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-4">
            Our Mission & Vision
          </p>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-900 dark:text-white leading-[1.12]">
            Cities designed for everyone. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Without physical barriers.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Standard maps tell you the shortest path. AccessPath tells you the <em>safest, smoothest, and most dignifying</em> path. We combine crowdsourced pedestrian audits with PostGIS spatial computing to eliminate guesswork.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-600/20"
            >
              <span>Explore Locations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/guidelines"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/80 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white font-semibold text-sm transition-all"
            >
              <span>Auditing Guidelines</span>
            </Link>
          </div>
        </div>
      </section>

      {/* The Core Problem & Our Answer */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 mb-4">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>The Urban Blind Spot</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Why traditional GPS fails disabled pedestrians
            </h2>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm sm:text-base">
              Traditional navigation apps assume every person is an able-bodied walker. They will send a wheelchair user up an eight-step flight of stairs, direct a parent with a twin stroller onto a broken sidewalk, or route a visually impaired commuter into an unmonitored construction pit.
            </p>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm sm:text-base">
              A single 15cm missing curb ramp or broken subway elevator can add 45 minutes of hazardous backtracking to a routine trip.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl glass border border-neutral-200/60 dark:border-neutral-800/60 space-y-2">
              <span className="text-3xl font-black text-rose-600">1.3B+</span>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Global Disabled Population</h3>
              <p className="text-xs text-neutral-500">Over 16% of the world experiences significant disability.</p>
            </div>
            <div className="p-6 rounded-3xl glass border border-neutral-200/60 dark:border-neutral-800/60 space-y-2">
              <span className="text-3xl font-black text-amber-500">72%</span>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Unmapped Obstacles</h3>
              <p className="text-xs text-neutral-500">Pavements, stairs, and broken lifts omitted in standard maps.</p>
            </div>
            <div className="p-6 rounded-3xl glass border border-neutral-200/60 dark:border-neutral-800/60 space-y-2">
              <span className="text-3xl font-black text-emerald-500">100%</span>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Free & Open Access</h3>
              <p className="text-xs text-neutral-500">Available to all citizens, researchers, and urban advocates.</p>
            </div>
            <div className="p-6 rounded-3xl glass border border-neutral-200/60 dark:border-neutral-800/60 space-y-2">
              <span className="text-3xl font-black text-teal-500">0 - 100</span>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Objective Metric</h3>
              <p className="text-xs text-neutral-500">Transparent scoring backed by verifiable ground audits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Pillars of AccessPath */}
      <section className="py-20 border-t border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-100/40 dark:bg-neutral-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Our Core Principles</h2>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              How AccessPath combines technology with community power to solve urban isolation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl glass space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">1. Verified Spatial Crowdsourcing</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Every barrier report includes GPS coordinates, severity classification, and photograph evidence. Our regional moderator queue ensures spam-free, reliable updates within hours.
              </p>
            </div>

            <div className="p-8 rounded-3xl glass space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Navigation2 className="w-6 h-6 rotate-45" />
              </div>
              <h3 className="text-lg font-bold">2. Barrier-Penalized Routing</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Rather than calculating distance alone, our routing engine uses weighted cost penalties for steps, missing curb ramps, and high surface roughness, guiding users through certified elevators and level footpaths.
              </p>
            </div>

            <div className="p-8 rounded-3xl glass space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">3. Civic Data Advocacy</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                We empower local disability advocacy groups and city planners by aggregating hotspot maps of inaccessible infrastructure, driving municipal repairs where they matter most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Scoring Works */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
            The Algorithm
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            How the 0–100 Accessibility Score Works
          </h2>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Locations earn points across five standardized accessibility categories verified by ground scouts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl glass border border-neutral-200/60 dark:border-neutral-800/60">
            <div className="text-emerald-600 font-black text-2xl mb-1">+30 pts</div>
            <h4 className="font-bold text-sm">Entrance & Ramps</h4>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Step-free level entry, certified slope &lt; 1:12, automatic doors &gt; 85cm width.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass border border-neutral-200/60 dark:border-neutral-800/60">
            <div className="text-teal-600 font-black text-2xl mb-1">+25 pts</div>
            <h4 className="font-bold text-sm">Internal Circulation</h4>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Spacious accessible bathroom stalls with grab bars, wide hallways, clear turning radius.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass border border-neutral-200/60 dark:border-neutral-800/60">
            <div className="text-blue-600 font-black text-2xl mb-1">+25 pts</div>
            <h4 className="font-bold text-sm">Elevators & Vertical</h4>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Auditory voice floor announcements, low Braille buttons, roomy cabins for powerchairs.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass border border-neutral-200/60 dark:border-neutral-800/60">
            <div className="text-purple-600 font-black text-2xl mb-1">+20 pts</div>
            <h4 className="font-bold text-sm">Sensory & Amenities</h4>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Tactile paving guidance, high-contrast signs, reserved disabled parking bays.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16 border-t border-neutral-200/60 dark:border-neutral-800/60">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">Help us map the next mile</h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            Whether you are a wheelchair user, a daily commuter, or a student advocate, reporting a single sidewalk obstruction takes less than 30 seconds and protects your whole neighborhood.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/submit-barrier"
              className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-all shadow-md shadow-rose-600/20"
            >
              Report a Barrier Today
            </Link>
            <Link
              href="/route-planner"
              className="px-6 py-3 rounded-full glass hover:bg-white/80 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white font-semibold text-sm transition-all"
            >
              Try Route Calculator
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
