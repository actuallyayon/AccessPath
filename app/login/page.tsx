'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogIn, Key, Mail, User, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'signin' | 'signup'>('signin')
  
  // Sign In state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Sign Up state
  const [signUpFullName, setSignUpFullName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpRole, setSignUpRole] = useState<'user' | 'contributor'>('user')
  
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMsg(error.message)
      } else {
        setSuccessMsg('Successfully signed in! Redirecting...')
        setTimeout(() => {
          router.push('/explore')
          router.refresh()
        }, 800)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
        options: {
          data: {
            full_name: signUpFullName,
            role: signUpRole,
          },
        },
      })

      if (error) {
        setErrorMsg(error.message)
      } else {
        setSuccessMsg(
          data?.session
            ? 'Account created and signed in! Redirecting...'
            : 'Account registered! You can now sign in with your credentials.'
        )
        if (data?.session) {
          setTimeout(() => {
            router.push('/explore')
            router.refresh()
          }, 1000)
        } else {
          setTab('signin')
          setEmail(signUpEmail)
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-16 w-full flex-1 flex flex-col justify-center">
      <div className="p-8 rounded-3xl glass shadow-2xl space-y-6">
        {/* Toggle Sign In / Create Account */}
        <div className="flex rounded-full p-1 glass-pill border">
          <button
            type="button"
            onClick={() => { setTab('signin'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 rounded-full font-bold text-xs transition-all cursor-pointer ${
              tab === 'signin'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('signup'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 rounded-full font-bold text-xs transition-all cursor-pointer ${
              tab === 'signup'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Create New Account
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {tab === 'signin' ? 'Sign In to AccessPath' : 'Create an Account'}
          </h1>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            {tab === 'signin'
              ? 'Enter your registered email and password below.'
              : 'Join as a citizen or active community contributor.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-semibold backdrop-blur-md">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-semibold backdrop-blur-md flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl glass text-xs font-medium focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Password
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl glass text-xs font-medium focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>

            {/* Quick 1-Click Demo Login Buttons */}
            <div className="pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60">
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2.5 text-center">
                Instant Demo Access (1-Click Fill)
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@accesspath.demo')
                    setPassword('AccessPassword123!')
                  }}
                  className="p-2.5 rounded-xl border border-purple-500/20 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold text-left transition-all cursor-pointer"
                >
                  <p className="font-extrabold text-[11px]">Admin</p>
                  <p className="text-[10px] opacity-75 truncate">Full analytics & controls</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail('moderator@accesspath.demo')
                    setPassword('AccessPassword123!')
                  }}
                  className="p-2.5 rounded-xl border border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-bold text-left transition-all cursor-pointer"
                >
                  <p className="font-extrabold text-[11px]">Moderator</p>
                  <p className="text-[10px] opacity-75 truncate">Audit queues & verify</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail('contributor@accesspath.demo')
                    setPassword('AccessPassword123!')
                  }}
                  className="p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold text-left transition-all cursor-pointer"
                >
                  <p className="font-extrabold text-[11px]">Contributor</p>
                  <p className="text-[10px] opacity-75 truncate">Add places & hazards</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail('user@accesspath.demo')
                    setPassword('AccessPassword123!')
                  }}
                  className="p-2.5 rounded-xl border border-neutral-300/60 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 text-xs font-bold text-left transition-all cursor-pointer"
                >
                  <p className="font-extrabold text-[11px]">Regular User</p>
                  <p className="text-[10px] opacity-75 truncate">Route planning & reviews</p>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* SIGN UP FORM */}
        {tab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={signUpFullName}
                  onChange={(e) => setSignUpFullName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl glass text-xs font-medium focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="sarah@example.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl glass text-xs font-medium focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Create Password
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl glass text-xs font-medium focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSignUpRole('user')}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    signUpRole === 'user'
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                      : 'border-neutral-200/50 glass text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  Regular User
                </button>
                <button
                  type="button"
                  onClick={() => setSignUpRole('contributor')}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    signUpRole === 'contributor'
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                      : 'border-neutral-200/50 glass text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  Contributor
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <span>Register & Create Profile</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
