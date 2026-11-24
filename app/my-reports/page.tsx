import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AlertTriangle, Clock, CheckCircle2, XCircle, PlusCircle, ArrowLeft } from 'lucide-react'

export default async function MyReportsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch barrier reports for this user or demo fallback
  const { data: reports } = await supabase
    .from('barrier_reports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

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
                      <span>Verified by Moderator</span>
                    </span>
                  )}
                  {report.status === 'pending' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Under Review</span>
                    </span>
                  )}
                  {report.status === 'resolved' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Hazard Resolved</span>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  {report.description}
                </p>

                <p className="text-[11px] text-neutral-400">
                  Reported on {new Date(report.created_at).toLocaleDateString()}
                </p>
              </div>

              {report.image_url && (
                <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
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
