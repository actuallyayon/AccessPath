'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, MapPin, UploadCloud, CheckCircle2, Loader2, Navigation } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const BARRIER_CATEGORIES = [
  { value: 'broken_footpath', label: 'Broken Footpath / Pavement Hazard', desc: 'Cracked, uneven, or collapsed walking surface' },
  { value: 'missing_ramp', label: 'Missing Ramp / Inaccessible Curb', desc: 'No dropped curb transition at sidewalk end' },
  { value: 'blocked_sidewalk', label: 'Blocked Sidewalk / Construction Obstacle', desc: 'Vehicles, vendors, or construction blocking path' },
  { value: 'broken_elevator', label: 'Out of Order Elevator / Lift', desc: 'Transfer elevator non-functional with no ramp' },
  { value: 'unsafe_crossing', label: 'Unsafe Crossing / Lack of Audio/Tactile Signals', desc: 'Dangerous intersection or missing tactile paving' },
]

export default function SubmitBarrierForm() {
  const router = useRouter()
  const [category, setCategory] = useState('broken_footpath')
  const [description, setDescription] = useState('')
  const [latitude, setLatitude] = useState('23.8103')
  const [longitude, setLongitude] = useState('90.4125')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6))
        setLongitude(pos.coords.longitude.toFixed(6))
        setLocating(false)
      },
      () => {
        setErrorMsg('Unable to retrieve your current location. Please enter manually.')
        setLocating(false)
      }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const latNum = parseFloat(latitude)
    const lngNum = parseFloat(longitude)

    if (isNaN(latNum) || isNaN(lngNum) || latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      setErrorMsg('Please enter valid coordinates (-90 to 90 lat, -180 to 180 lng)')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      // Insert barrier report
      const { error } = await supabase.from('barrier_reports').insert({
        category: category as any,
        description,
        coordinates: `POINT(${lngNum} ${latNum})`,
        image_url: imageUrl || null,
        reporter_id: user?.id || null,
        status: 'pending',
      })

      if (error) {
        setErrorMsg(error.message)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/my-reports')
        }, 1500)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit barrier report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Report an Accessibility Barrier</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Crowdsourced reports protect mobility-challenged citizens and prompt municipal repairs.
        </p>
      </div>

      {success && (
        <div className="p-4 mb-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Report submitted successfully! Redirecting to My Reports...</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 mb-6 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        {/* Category Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2">
            Barrier Category
          </label>
          <div className="grid grid-cols-1 gap-2">
            {BARRIER_CATEGORIES.map((cat) => (
              <label
                key={cat.value}
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                  category === cat.value
                    ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30'
                    : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.value}
                  checked={category === cat.value}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 text-rose-600 focus:ring-rose-500"
                />
                <div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">{cat.label}</div>
                  <div className="text-[11px] text-neutral-500">{cat.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2">
            Description & Impact
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the physical condition (e.g. Deep trench across sidewalk with no ramp or pedestrian plank, manual wheelchair cannot pass)..."
            className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
          />
        </div>

        {/* GPS Capture */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              GPS Location Coordinates
            </label>
            <button
              type="button"
              onClick={handleUseGPS}
              disabled={locating}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{locating ? 'Acquiring GPS...' : 'Use My Current Location'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] text-neutral-400">Latitude</span>
              <input
                type="text"
                required
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs"
              />
            </div>
            <div>
              <span className="text-[10px] text-neutral-400">Longitude</span>
              <input
                type="text"
                required
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Photo URL */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2">
            Photo Verification Evidence (Image URL)
          </label>
          <div className="relative">
            <UploadCloud className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... or uploaded photo link"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs sm:text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Report...</span>
            </>
          ) : (
            <span>Submit Barrier Report</span>
          )}
        </button>
      </form>
    </div>
  )
}
