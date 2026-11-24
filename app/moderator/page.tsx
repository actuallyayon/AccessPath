import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ShieldCheck, Check, X, Clock, MapPin, AlertTriangle } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function ModeratorPage() {
  const supabase = await createClient()

  // 1. Fetch pending locations
  const { data: pendingLocations } = await supabase
    .from('locations')
    .select('id, name, address, created_at, accessibility_score')
    .eq('verification_status', 'pending')
    .order('created_at', { ascending: false })
    .limit(15)

  // 2. Fetch pending barrier reports
  const { data: pendingBarriers } = await supabase
    .from('barrier_reports')
    .select('id, category, description, created_at, image_url')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(15)

  // Server Actions for verification
  async function handleVerifyLocation(formData: FormData) {
    'use server'
    const locId = formData.get('locId') as string
    const action = formData.get('action') as string
    const client = await createClient()
    await client
      .from('locations')
      .update({
        verification_status: action === 'approve' ? 'verified' : 'rejected',
      })
      .eq('id', locId)
    revalidatePath('/moderator')
  }

  async function handleVerifyBarrier(formData: FormData) {
    'use server'
    const barrierId = formData.get('barrierId') as string
    const action = formData.get('action') as string
    const client = await createClient()
    await client
      .from('barrier_reports')
      .update({
        status: action === 'approve' ? 'verified' : 'rejected',
      })
      .eq('id', barrierId)
    revalidatePath('/moderator')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <h1 className="text-2xl font-bold tracking-tight">Moderation Queue</h1>
        </div>
        <p className="text-xs text-neutral-500">
          Review community-submitted places and barrier reports. Approved items earn verified trust badges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Locations Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="font-bold text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Pending Locations</span>
            </h2>
            <span className="text-xs text-neutral-400">
              {pendingLocations?.length || 0} waiting
            </span>
          </div>

          {!pendingLocations || pendingLocations.length === 0 ? (
            <p className="text-xs text-neutral-400 py-6 text-center">
              No pending location submissions!
            </p>
          ) : (
            pendingLocations.map((loc) => (
              <div
                key={loc.id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-xs">{loc.name}</h3>
                    <p className="text-[11px] text-neutral-500">{loc.address}</p>
                  </div>
                  <span className="text-[10px] text-neutral-400">
                    {new Date(loc.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <form action={handleVerifyLocation}>
                    <input type="hidden" name="locId" value={loc.id} />
                    <input type="hidden" name="action" value="reject" />
                    <button
                      type="submit"
                      className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </form>
                  <form action={handleVerifyLocation}>
                    <input type="hidden" name="locId" value={loc.id} />
                    <input type="hidden" name="action" value="approve" />
                    <button
                      type="submit"
                      className="px-2.5 py-1 rounded bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Place</span>
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pending Barrier Reports Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="font-bold text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Pending Barrier Reports</span>
            </h2>
            <span className="text-xs text-neutral-400">
              {pendingBarriers?.length || 0} waiting
            </span>
          </div>

          {!pendingBarriers || pendingBarriers.length === 0 ? (
            <p className="text-xs text-neutral-400 py-6 text-center">
              No pending barrier reports!
            </p>
          ) : (
            pendingBarriers.map((bar) => (
              <div
                key={bar.id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                      {bar.category.replace('_', ' ')}
                    </span>
                    <p className="text-xs text-neutral-800 dark:text-neutral-200 mt-0.5">
                      {bar.description}
                    </p>
                  </div>
                  <span className="text-[10px] text-neutral-400 shrink-0">
                    {new Date(bar.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <form action={handleVerifyBarrier}>
                    <input type="hidden" name="barrierId" value={bar.id} />
                    <input type="hidden" name="action" value="reject" />
                    <button
                      type="submit"
                      className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </form>
                  <form action={handleVerifyBarrier}>
                    <input type="hidden" name="barrierId" value={bar.id} />
                    <input type="hidden" name="action" value="approve" />
                    <button
                      type="submit"
                      className="px-2.5 py-1 rounded bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Verify Barrier</span>
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
