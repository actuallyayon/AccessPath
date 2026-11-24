'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  MapPin, 
  Navigation2, 
  AlertTriangle, 
  ShieldCheck, 
  PlusCircle, 
  LogIn, 
  LayoutDashboard,
  Compass,
  Sparkles,
  Info
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { createClient } from '@/lib/supabase/client'

export function Navbar({ userRole: initialRole }: { userRole?: string | null }) {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<string | null>(initialRole || null)

  useEffect(() => {
    async function checkUser() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
          if (profile) setUserRole(profile.role)
        }
      } catch {}
    }
    checkUser()
  }, [])

  const navLinks = [
    { href: '/explore', label: 'Explore Places', icon: MapPin },
    { href: '/map', label: 'Map View', icon: Compass },
    { href: '/route-planner', label: 'Route Planner', icon: Navigation2 },
    { href: '/submit-barrier', label: 'Report Barrier', icon: AlertTriangle },
    { href: '/about', label: 'About', icon: Info },
  ]

  return (
    <header className="sticky top-0 z-50 w-full glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 group"
        >
          <div className="p-2 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform">
            <Navigation2 className="w-4 h-4 rotate-45" />
          </div>
          <span className="font-black text-lg tracking-tight text-neutral-900 dark:text-white">
            Access<span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Path</span>
          </span>
        </Link>

        {/* Center Pill Nav */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full glass-pill shadow-xs">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25'
                    : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white hover:bg-white/40 dark:hover:bg-neutral-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {userRole === 'admin' && (
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/20 backdrop-blur-md hover:bg-purple-500/25 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          )}

          {userRole === 'moderator' && (
            <Link
              href="/moderator"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/20 backdrop-blur-md hover:bg-blue-500/25 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Moderator</span>
            </Link>
          )}

          {(userRole === 'contributor' || userRole === 'admin') && (
            <Link
              href="/submit-location"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 backdrop-blur-md hover:bg-emerald-500/25 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add</span>
            </Link>
          )}

          <ThemeToggle />

          <Link
            href="/login"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:scale-102 transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
