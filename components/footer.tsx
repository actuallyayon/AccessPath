import Link from 'next/link'
import { 
  Navigation2, 
  MapPin, 
  AlertTriangle, 
  Compass, 
  ShieldCheck, 
  Heart, 
  ExternalLink, 
  Globe, 
  Layers, 
  CheckCircle2,
  Sparkles,
  Info,
  BookOpen
} from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-xl text-neutral-600 dark:text-neutral-400">
      {/* Upper Status & Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="p-2 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform">
                <Navigation2 className="w-5 h-5 rotate-45" />
              </div>
              <span className="font-black text-xl tracking-tight text-neutral-900 dark:text-white">
                Access<span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Path</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 max-w-sm">
              Universal urban navigation engineered for wheelchair users, seniors, parents with strollers, and mobility-impaired pedestrians. Realtime sidewalk hazard reporting with open PostGIS mapping.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>PostGIS Spatial Cluster Online</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                <span>WCAG 2.1 AA</span>
              </div>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-500 pt-1">
              Data verified under Open Database License (ODbL) and crowdsourced municipal guidelines.
            </p>
          </div>

          {/* Column 1: Navigation & Mapping */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/explore" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 opacity-70" />
                  <span>Explore Places</span>
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 opacity-70" />
                  <span>Interactive Map</span>
                </Link>
              </li>
              <li>
                <Link href="/route-planner" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Navigation2 className="w-3.5 h-3.5 opacity-70 rotate-45" />
                  <span>Route Scoring Engine</span>
                </Link>
              </li>
              <li>
                <Link href="/submit-barrier" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 opacity-70" />
                  <span>Report Hazard</span>
                </Link>
              </li>
              <li>
                <Link href="/submit-location" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 opacity-70" />
                  <span>Submit Venue</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Platform & Standards */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Platform & Standards
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 opacity-70" />
                  <span>About Our Mission</span>
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 opacity-70" />
                  <span>Auditing Guidelines</span>
                </Link>
              </li>
              <li>
                <Link href="/moderator" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 opacity-70" />
                  <span>Moderation Queue</span>
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 opacity-70" />
                  <span>Analytics & Data</span>
                </Link>
              </li>
              <li>
                <a 
                  href="https://www.w3.org/WAI/standards-guidelines/wcag/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  <span>WCAG Compliance</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Active Pilot Regions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Pilot Cities
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Dhaka</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold">Active</span>
              </li>
              <li className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Khulna</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold">Active</span>
              </li>
              <li className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                  <span>Chittagong</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 font-semibold">Expanding</span>
              </li>
              <li className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-purple-500" />
                  <span>London Transit</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 font-semibold">Beta</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-neutral-200/60 dark:border-neutral-800/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex flex-wrap items-center gap-4">
            <p>© 2026 AccessPath Urban Mobility. Built for inclusive cities.</p>
            <span className="hidden sm:inline">•</span>
            <Link href="/about" className="hover:underline">Mission</Link>
            <span>•</span>
            <Link href="/guidelines" className="hover:underline">Auditing Standards</Link>
            <span>•</span>
            <Link href="/explore" className="hover:underline">Directory</Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero-Barrier Navigation</span>
            </span>
            <span>•</span>
            <span>Made for Public Good</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
