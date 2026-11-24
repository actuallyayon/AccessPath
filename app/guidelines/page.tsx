import Link from 'next/link'
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Camera, 
  MapPin, 
  ShieldCheck, 
  Ruler, 
  ArrowRight,
  Eye,
  SlidersHorizontal
} from 'lucide-react'

export const metadata = {
  title: 'Auditing Guidelines | AccessPath Community Standards',
  description: 'Learn how to accurately audit and document accessible infrastructure, ramps, elevators, and sidewalk barriers for AccessPath.',
}

export default function GuidelinesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="relative pt-16 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-neutral-200/60 dark:border-neutral-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-4">
            Scouting & Verification Playbook
          </p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 dark:text-white">
            Community Auditing Standards
          </h1>
          <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Consistent, high-integrity spatial data is what makes AccessPath reliable. Follow these field guidelines when submitting venue accessibility reviews or road hazard reports.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Core Dimensions Checklist */}
        <div>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">1. Critical Physical Dimensions</h2>
              <p className="text-xs text-neutral-500">Benchmark measurements recommended by international ADA & ISO 21542 standards.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl glass border border-emerald-500/20 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ramp Grade & Incline</span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                A compliant ramp must have a slope ratio no steeper than <strong>1:12</strong> (approx. 4.8 degrees). If a manual wheelchair user cannot safely push themselves up without tipping backward, mark as <em>Steep Slope Hazard</em>.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass border border-emerald-500/20 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Doorway Clear Width</span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Primary and restroom doorways must have at least <strong>85 cm (32 inches)</strong> of clear, unobstructed width when fully opened. Heavy manual swinging doors without assist buttons should be noted.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass border border-emerald-500/20 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Elevator Interior Dimensions</span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Elevator cabin must measure at least <strong>140 cm deep by 110 cm wide</strong> to permit full turning radius for powerchairs. Must feature audio floor chimes and Braille button embossment.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass border border-emerald-500/20 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Curb Cuts & Pavement Lips</span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Pedestrian curb ramps must meet road level with less than <strong>6 mm vertical lip</strong>. A 2-inch sudden asphalt ledge can jam front caster wheels and throw passengers forward.
              </p>
            </div>
          </div>
        </div>

        {/* Photography Standards */}
        <div>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">2. Photography Best Practices</h2>
              <p className="text-xs text-neutral-500">Good photographs allow regional moderators to approve reports in minutes.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl glass space-y-2">
              <h4 className="font-bold text-sm text-emerald-600">Wide Context View</h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Take one wide shot showing the entire entrance or obstacle relative to the street or sidewalk.
              </p>
            </div>

            <div className="p-5 rounded-2xl glass space-y-2">
              <h4 className="font-bold text-sm text-emerald-600">Close-Up on Problem</h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Capture the specific obstacle (e.g. step height, broken elevator notice, cracked paving, missing curb cut).
              </p>
            </div>

            <div className="p-5 rounded-2xl glass space-y-2">
              <h4 className="font-bold text-sm text-rose-600">Avoid People & Plates</h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Respect pedestrian privacy: avoid capturing recognizable faces or private vehicle license plates.
              </p>
            </div>
          </div>
        </div>

        {/* Hazard Classifications */}
        <div>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">3. Hazard Severity Tiers</h2>
              <p className="text-xs text-neutral-500">Accurate severity ratings tune the cost penalty in our routing calculator.</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-5 rounded-2xl glass border-l-4 border-rose-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Critical / Impassable (Severity 5)</span>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white mt-0.5">
                  Complete roadblock: Flight of stairs with zero ramp alternative, active deep ditch, broken sole elevator.
                </p>
                <p className="text-xs text-neutral-500 mt-1">Routing effect: Excluded completely from accessible route calculations.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl glass border-l-4 border-amber-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Moderate Hazard (Severity 3)</span>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white mt-0.5">
                  Steep ramp (&gt; 1:8), loose gravel, 5cm cracked asphalt, temporary scaffolding obstruction.
                </p>
                <p className="text-xs text-neutral-500 mt-1">Routing effect: Heavy penalty applied; alternative smooth route preferred.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl glass border-l-4 border-emerald-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Resolved / Safe (Severity 1)</span>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white mt-0.5">
                  Repaired sidewalk, newly installed tactile paving, or newly opened wheelchair ramp.
                </p>
                <p className="text-xs text-neutral-500 mt-1">Routing effect: Preferred corridor bonus applied to neighborhood routes.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 rounded-3xl glass text-center max-w-3xl mx-auto border border-emerald-500/20">
          <h3 className="text-xl font-bold">Ready to contribute?</h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Submit your first barrier report with GPS coordinates and help thousands navigate safely.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/submit-barrier"
              className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all"
            >
              Report Sidewalk Hazard
            </Link>
            <Link
              href="/explore"
              className="px-6 py-3 rounded-full glass hover:bg-white/80 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white font-semibold text-sm transition-all"
            >
              Audit a Venue
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
