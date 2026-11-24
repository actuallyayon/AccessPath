import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  const adminPaths = ['/admin', '/admin/settings', '/admin/users', '/admin/analytics']
  const moderatorPaths = ['/moderator', '/moderator/queue']
  const contributorPaths = ['/contribute', '/contribute/submissions']
  const userProtectedPaths = ['/profile', '/my-reports', '/favorites', '/submit-barrier', '/submit-location']

  const isRoleProtected =
    adminPaths.some((p) => path.startsWith(p)) ||
    moderatorPaths.some((p) => path.startsWith(p)) ||
    contributorPaths.some((p) => path.startsWith(p)) ||
    userProtectedPaths.some((p) => path.startsWith(p))

  if (!user && isRoleProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', path)
    return NextResponse.redirect(url)
  }

  if (user && isRoleProtected) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role || 'user'

    if (adminPaths.some((p) => path.startsWith(p)) && role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/unauthorized'
      return NextResponse.redirect(url)
    }

    if (
      moderatorPaths.some((p) => path.startsWith(p)) &&
      role !== 'moderator' &&
      role !== 'admin'
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/unauthorized'
      return NextResponse.redirect(url)
    }

    if (
      contributorPaths.some((p) => path.startsWith(p)) &&
      role !== 'contributor' &&
      role !== 'moderator' &&
      role !== 'admin'
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/unauthorized'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
