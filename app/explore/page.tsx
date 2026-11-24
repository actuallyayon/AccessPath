import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatScore, formatDistance } from '@/lib/utils'
import { Search, Filter, CheckCircle2, AlertCircle, ChevronRight, SlidersHorizontal, MapPin } from 'lucide-react'

interface SearchParams {
  q?: string
  category?: string
  minScore?: string
  wheelchair?: string
  ramp?: string
  elevator?: string
  restroom?: string
  parking?: string
  page?: string
  sort?: string
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const query = params.q || ''
  const categorySlug = params.category || ''
  const minScore = params.minScore ? parseFloat(params.minScore) : 0
  const currentPage = params.page ? parseInt(params.page, 10) : 1
  const pageSize = 12

  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, icon')
    .order('name')

  let activeCategoryId: string | null = null
  if (categorySlug && categories) {
    const matched = categories.find((c) => c.slug === categorySlug)
    if (matched) activeCategoryId = matched.id
  }

  const featuresFilter: Record<string, boolean> = {}
  if (params.wheelchair === 'true') featuresFilter.wheelchair_access = true
  if (params.ramp === 'true') featuresFilter.ramp_available = true
  if (params.elevator === 'true') featuresFilter.elevator_available = true
  if (params.restroom === 'true') featuresFilter.accessible_restroom = true
  if (params.parking === 'true') featuresFilter.accessible_parking = true

  let locations: any[] = []
  let totalCount = 0

  try {
    const { data, error } = await supabase.rpc('search_locations', {
      query: query || null,
      category_ids: activeCategoryId ? [activeCategoryId] : null,
      features: Object.keys(featuresFilter).length > 0 ? featuresFilter : null,
      min_score: minScore > 0 ? minScore : null,
      sort_by: params.sort || 'score_desc',
      page_num: currentPage,
      page_size: pageSize,
    })

    if (!error && data) {
      locations = data
      totalCount = data[0]?.total_count || 0
    }
  } catch (err) {
    console.error('Failed to search locations:', err)
  }

  const totalPages = Math.ceil(totalCount / pageSize) || 1

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Top Header & Glass Search Bar */}
      <div className="flex flex-col gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Explore Accessible Places</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Search vetted accessible venues, public facilities, and community-rated places.
          </p>
        </div>

        {/* Search form with Glass styling */}
        <form method="GET" action="/explore" className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by venue name, address, or keyword (e.g. Hospital, Mirpur Road, City Center)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl glass focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-xs sm:text-sm font-medium"
            />
          </div>

          {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
          {params.sort && <input type="hidden" name="sort" value={params.sort} />}

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer hover:scale-102"
          >
            <span>Search Places</span>
          </button>
        </form>

        {/* Category Glass Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <Link
            href="/explore"
            className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${
              !categorySlug
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                : 'glass hover:bg-white/80 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
            }`}
          >
            All Categories
          </Link>
          {categories?.map((cat) => (
            <Link
              key={cat.id}
              href={`/explore?category=${cat.slug}${query ? `&q=${encodeURIComponent(query)}` : ''}`}
              className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${
                categorySlug === cat.slug
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                  : 'glass hover:bg-white/80 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content: Filter sidebar + Results grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Column (Glass Card) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl glass space-y-5">
            <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <span>Accessibility Filters</span>
            </div>

            <form method="GET" action="/explore" className="space-y-4 text-xs font-medium">
              {query && <input type="hidden" name="q" value={query} />}
              {categorySlug && <input type="hidden" name="category" value={categorySlug} />}

              <div className="space-y-3">
                {[
                  { name: 'wheelchair', label: 'Wheelchair Entrance', checked: params.wheelchair === 'true' },
                  { name: 'ramp', label: 'Ramp Available', checked: params.ramp === 'true' },
                  { name: 'elevator', label: 'Elevator Available', checked: params.elevator === 'true' },
                  { name: 'restroom', label: 'Accessible Restroom', checked: params.restroom === 'true' },
                  { name: 'parking', label: 'Accessible Parking', checked: params.parking === 'true' },
                ].map((f) => (
                  <label key={f.name} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      name={f.name}
                      value="true"
                      defaultChecked={f.checked}
                      className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{f.label}</span>
                  </label>
                ))}
              </div>

              <div className="pt-4 border-t border-neutral-200/50 dark:border-neutral-800/50">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Min Accessibility Score
                </label>
                <select
                  name="minScore"
                  defaultValue={params.minScore || '0'}
                  className="w-full py-2.5 px-3 rounded-xl glass text-xs font-semibold cursor-pointer"
                >
                  <option value="0">Any Score</option>
                  <option value="50">50+ (Moderate & above)</option>
                  <option value="75">75+ (High Accessibility)</option>
                  <option value="90">90+ (Fully Accessible)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
              >
                Apply Filters
              </button>
            </form>
          </div>
        </div>

        {/* Right Places List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1 px-1">
            <span>
              Found <strong className="text-neutral-900 dark:text-neutral-100 font-extrabold">{totalCount.toLocaleString()}</strong> accessible locations
            </span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>

          {locations.length === 0 ? (
            <div className="p-16 text-center rounded-3xl glass">
              <MapPin className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <h3 className="text-base font-bold">No locations found</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Try adjusting your search terms or clearing specific accessibility filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {locations.map((loc) => {
                const scoreInfo = formatScore(Number(loc.accessibility_score))
                return (
                  <Link
                    key={loc.id}
                    href={`/locations/${loc.id}`}
                    className="p-6 rounded-3xl glass hover:border-emerald-500/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-neutral-100/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300">
                          {loc.category_name || 'Public Facility'}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {loc.verification_status === 'verified' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verified</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Unverified</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Address */}
                      <h3 className="font-extrabold text-base text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-600 transition-colors">
                        {loc.name}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                        {loc.address}
                      </p>

                      {/* Feature Checklist Badges */}
                      <div className="mt-4 flex flex-wrap gap-1.5 text-[11px]">
                        {loc.wheelchair_access && (
                          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-500/10">
                            Wheelchair
                          </span>
                        )}
                        {loc.ramp_available && (
                          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-500/10">
                            Ramp
                          </span>
                        )}
                        {loc.elevator_available && (
                          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-500/10">
                            Elevator
                          </span>
                        )}
                        {loc.accessible_restroom && (
                          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-500/10">
                            Restroom
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Score & Action */}
                    <div className="mt-6 pt-4 border-t border-neutral-200/50 dark:border-neutral-800/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-xl text-xs font-black ${scoreInfo.badgeBg}`}>
                          {Math.round(Number(loc.accessibility_score))} / 100
                        </span>
                        <span className="text-[11px] text-neutral-500 font-bold">
                          {scoreInfo.label}
                        </span>
                      </div>

                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              {currentPage > 1 && (
                <Link
                  href={`/explore?page=${currentPage - 1}${query ? `&q=${encodeURIComponent(query)}` : ''}${categorySlug ? `&category=${categorySlug}` : ''}`}
                  className="px-4 py-2 rounded-full glass text-xs font-bold hover:scale-105 transition-transform"
                >
                  Previous
                </Link>
              )}
              <span className="text-xs font-bold text-neutral-500 px-3">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages && (
                <Link
                  href={`/explore?page=${currentPage + 1}${query ? `&q=${encodeURIComponent(query)}` : ''}${categorySlug ? `&category=${categorySlug}` : ''}`}
                  className="px-4 py-2 rounded-full glass text-xs font-bold hover:scale-105 transition-transform"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
