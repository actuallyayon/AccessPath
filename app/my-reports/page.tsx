import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AlertTriangle, Clock, CheckCircle2, XCircle, PlusCircle, LogIn } from 'lucide-react'

export default async function MyReportsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="p-8 rounded-3xl glass space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h1 className="text-xl font-bold">Sign In to View Your Reports</h1>
          <p className="text-xs text-neutral-500">
            Please sign in to track the verification status of your reported barriers.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    )
  }

  // Fetch real barrier reports submitted by this authenticated user
  const { data: reports } = await supabase
    .from('barrier_reports')
    .select('*')
    .eq('reporter_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Accessibility Barrier Reports</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Track community verification and municipal resolution status of your reported obstacles.
          </p>
        </div>

        <Link
          href="/submit-barrier"
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 w-fit"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Report New Barrier</span>
        </Link>
      </div>

      {!reports || reports.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900">
          <AlertTriangle className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
          <h2 className="text-sm font-semibold">No barrier reports submitted yet</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Notice a broken sidewalk or missing curb cut? Submit a report to keep your city accessible.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    {report.category.replace('_', ' ')}
                  </span>

                  {report.status === 'verified' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified & Active</span>
                    </span>
                  )}
                  {report.status === 'pending' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600">
                      <Clock className="w-3.5 h-3.5" />
                      <span>In Review</span>
                    </span>
                  )}
                  {report.status === 'rejected' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Declined</span>
                    </span>
                  )}
                  {report.status === 'resolved' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Municipal Repair Completed</span>
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {report.description}
                </p>

                <p className="text-[11px] text-neutral-400">
                  Reported on {new Date(report.created_at).toLocaleDateString()}
                </p>
              </div>

              {report.image_url && (
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-800">
                  <img
                    src={report.image_url}
                    alt="Barrier evidence"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
