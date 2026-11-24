import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatScore } from '@/lib/utils'
import ClientMiniMap from '@/components/client-mini-map'
import { 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Heart, 
  Share2, 
  AlertTriangle, 
  MapPin, 
  Star, 
  Milestone,
  ArrowLeft 
} from 'lucide-react'

export default async function LocationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: location, error: locError } = await supabase
    .from('locations')
    .select(`
      id,
      name,
      description,
      address,
      accessibility_score,
      verification_status,
      created_at,
      category:categories (id, name, slug, icon)
    `)
    .eq('id', id)
    .single()

  if (locError || !location) {
    notFound()
  }

  const { data: features } = await supabase
    .from('accessibility_features')
    .select('*')
    .eq('location_id', id)
    .single()

  const { data: feedbackList } = await supabase
    .from('feedback')
    .select(`
      id,
      rating,
      comment,
      created_at,
      user_id
    `)
    .eq('location_id', id)
    .order('created_at', { ascending: false })
    .limit(10)

  const lat = 23.8103
  const lng = 90.4125
  const scoreInfo = formatScore(Number(location.accessibility_score))

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full glass hover:scale-102 transition-transform"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Explore Places</span>
        </Link>
      </div>

      {/* Header Info Glass Card */}
      <div className="p-8 rounded-3xl glass shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-neutral-100/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300">
              {(location.category as any)?.name || 'Facility'}
            </span>

            {location.verification_status === 'verified' ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified by Moderators</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/15 border border-amber-500/20 px-3 py-1 rounded-full">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Unverified Community Submission</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {location.name}
          </h1>

          <div className="flex items-center gap-1.5 text-neutral-500 text-xs sm:text-sm mt-1">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{location.address}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          <Link
            href={`/route-planner?dest=${encodeURIComponent(location.name)}&lat=${lat}&lng=${lng}`}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 hover:scale-102"
          >
            <Milestone className="w-4 h-4" />
            <span>Plan Route Here</span>
          </Link>
          <Link
            href={`/submit-barrier?loc=${location.id}`}
            className="px-4 py-2.5 rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-bold text-xs sm:text-sm hover:bg-rose-500/20 transition-all flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Report Barrier</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Details & Map */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Accessibility Score Glass Card */}
          <div className="p-7 rounded-3xl glass shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-extrabold text-neutral-400">
                  Accessibility Score
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-5xl font-black text-neutral-900 dark:text-white">
                    {Math.round(Number(location.accessibility_score))}
                  </span>
                  <span className="text-neutral-400 text-sm font-bold">/ 100</span>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-2xl text-xs font-black ${scoreInfo.badgeBg} shadow-xs`}>
                {scoreInfo.label}
              </span>
            </div>

            <p className="text-xs text-neutral-500 mt-4 leading-relaxed font-medium">
              Score is computed live from physical entrance criteria, certified accessibility badges, and obstacle density within 100 meters.
            </p>
          </div>

          {/* Accessibility Checklist */}
          <div className="p-7 rounded-3xl glass shadow-lg space-y-4">
            <h2 className="text-base font-black">Accessibility Features Breakdown</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Wheelchair Entrance', val: features?.wheelchair_access },
                { label: 'Access Ramp Available', val: features?.ramp_available },
                { label: 'Elevator / Lift Available', val: features?.elevator_available },
                { label: 'Accessible Restroom', val: features?.accessible_restroom },
                { label: 'Designated Accessible Parking', val: features?.accessible_parking },
                { label: 'Stair-Free Entryway', val: features?.stair_free_entry },
                { label: 'Wide Doorways (≥ 85 cm)', val: features?.door_accessible },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all ${
                    item.val
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200'
                      : 'border-neutral-200/50 bg-neutral-100/40 text-neutral-400 dark:border-neutral-800/50 dark:bg-neutral-800/20'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.val ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <span className="text-[10px] text-neutral-400 font-semibold">Not present</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {location.description && (
            <div className="p-7 rounded-3xl glass shadow-lg space-y-2">
              <h2 className="text-base font-black">About this Location</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
                {location.description}
              </p>
            </div>
          )}

          {/* Feedback */}
          <div className="p-7 rounded-3xl glass shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black">Community Feedback & Reviews</h2>
              <span className="text-xs text-neutral-500 font-bold">{feedbackList?.length || 0} reviews</span>
            </div>

            {feedbackList && feedbackList.length > 0 ? (
              <div className="space-y-3">
                {feedbackList.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-4 rounded-2xl glass border-neutral-200/40 dark:border-neutral-800/40 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: fb.rating }).map((_, r) => (
                          <Star key={r} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-[11px] text-neutral-400 font-medium">
                        {new Date(fb.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{fb.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-500">No community reviews yet for this venue.</p>
            )}
          </div>
        </div>

        {/* Right Column: Mini Map */}
        <div className="md:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl glass shadow-lg space-y-4">
            <h2 className="text-sm font-black">Geographic Location</h2>
            <ClientMiniMap lat={lat} lng={lng} name={location.name} />
            <p className="text-[11px] text-neutral-400 font-mono">
              Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
