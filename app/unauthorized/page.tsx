import Link from 'next/link'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center flex-1 flex flex-col justify-center items-center">
      <div className="p-4 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 mb-4">
        <ShieldAlert className="w-10 h-10" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Access Restricted</h1>
      <p className="text-xs text-neutral-500 mt-2 max-w-sm">
        You do not possess the required role permissions (Admin or Moderator) to view this page.
      </p>
      <Link
        href="/explore"
        className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-semibold"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Explore</span>
      </Link>
    </div>
  )
}
