'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, Navigation, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SubmitLocationPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [latitude, setLatitude] = useState('23.8103')
  const [longitude, setLongitude] = useState('90.4125')

  // Feature checkboxes
  const [wheelchair, setWheelchair] = useState(false)
  const [ramp, setRamp] = useState(false)
  const [elevator, setElevator] = useState(false)
  const [restroom, setRestroom] = useState(false)
  const [parking, setParking] = useState(false)
  const [stairFree, setStairFree] = useState(false)
  const [doorAccess, setDoorAccess] = useState(false)

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [duplicateWarning, setDuplicateWarning] = useState<any[] | null>(null)
  const [success, setSuccess] = useState(false)

  // Duplicate Check on Blur
  const handleCheckDuplicates = async () => {
    if (!name || name.length < 3) return
    const latNum = parseFloat(latitude)
    const lngNum = parseFloat(longitude)
    if (isNaN(latNum) || isNaN(lngNum)) return

    try {
      const supabase = createClient()
      const { data } = await supabase.rpc('check_duplicate_location', {
        check_name: name,
        check_lng: lngNum,
        check_lat: latNum,
      })
      if (data && data.length > 0) {
        setDuplicateWarning(data)
      } else {
        setDuplicateWarning(null)
      }
    } catch {
      // Ignore if RPC unavailable
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const latNum = parseFloat(latitude)
    const lngNum = parseFloat(longitude)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      // 1. Insert into locations table (enforces status = 'pending')
      const { data: loc, error: locErr } = await supabase
        .from('locations')
        .insert({
          name,
          address,
          description: description || null,
          coordinates: `POINT(${lngNum} ${latNum})`,
          verification_status: 'pending',
          created_by: user?.id || null,
        })
        .select()
        .single()

      if (locErr) throw locErr

      // 2. Insert into accessibility_features
      if (loc) {
        await supabase.from('accessibility_features').insert({
          location_id: loc.id,
          wheelchair_access: wheelchair,
          ramp_available: ramp,
          elevator_available: elevator,
          accessible_restroom: restroom,
          accessible_parking: parking,
          stair_free_entry: stairFree,
          door_accessible: doorAccess,
          verified: false,
        })
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/explore')
      }, 1500)
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Submit New Accessible Location</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Contributions are reviewed by moderators before full verification badges are awarded.
        </p>
      </div>

      {success && (
        <div className="p-4 mb-6 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Location submitted for moderator review! Redirecting to Explore...</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 mb-6 rounded-xl bg-rose-50 text-rose-800 text-xs">{errorMsg}</div>
      )}

      {duplicateWarning && duplicateWarning.length > 0 && (
        <div className="p-4 mb-6 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 text-amber-800 dark:text-amber-200 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertCircle className="w-4 h-4" />
            <span>Possible Duplicate Places Detected Nearby:</span>
          </div>
          {duplicateWarning.map((d) => (
            <div key={d.id} className="text-[11px] ml-5">
              • <strong>{d.name}</strong> (~{Math.round(d.distance_meters)}m away)
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">
              Facility / Venue Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleCheckDuplicates}
              placeholder="e.g. Khulna City General Hospital"
              className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">
              Full Street Address
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 45 Kazi Nazrul Islam Avenue, Dhaka"
              className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">
                Latitude
              </label>
              <input
                type="text"
                required
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">
                Longitude
              </label>
              <input
                type="text"
                required
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">
              Accessibility Details / Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe access doors, ramp slope, staff assistance..."
              className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs"
            />
          </div>
        </div>

        {/* Accessibility Features Checklist */}
        <div>
          <label className="block text-xs font-semibold uppercase text-neutral-500 mb-3">
            Available Accessibility Features
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <label className="flex items-center gap-2 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer">
              <input type="checkbox" checked={wheelchair} onChange={(e) => setWheelchair(e.target.checked)} />
              <span>Wheelchair Entrance</span>
            </label>
            <label className="flex items-center gap-2 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer">
              <input type="checkbox" checked={ramp} onChange={(e) => setRamp(e.target.checked)} />
              <span>Access Ramp</span>
            </label>
            <label className="flex items-center gap-2 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer">
              <input type="checkbox" checked={elevator} onChange={(e) => setElevator(e.target.checked)} />
              <span>Elevator / Lift</span>
            </label>
            <label className="flex items-center gap-2 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer">
              <input type="checkbox" checked={restroom} onChange={(e) => setRestroom(e.target.checked)} />
              <span>Accessible Restroom</span>
            </label>
            <label className="flex items-center gap-2 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer">
              <input type="checkbox" checked={parking} onChange={(e) => setParking(e.target.checked)} />
              <span>Accessible Parking</span>
            </label>
            <label className="flex items-center gap-2 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer">
              <input type="checkbox" checked={stairFree} onChange={(e) => setStairFree(e.target.checked)} />
              <span>Stair-Free Entry</span>
            </label>
            <label className="flex items-center gap-2 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer">
              <input type="checkbox" checked={doorAccess} onChange={(e) => setDoorAccess(e.target.checked)} />
              <span>Wide Doorways</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Location...</span>
            </>
          ) : (
            <span>Submit for Verification</span>
          )}
        </button>
      </form>
    </div>
  )
}
