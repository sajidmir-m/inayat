import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const publicPages = [
      '/admin/login',
      '/admin/register',
      '/admin/test-connection',
    ]
    
    const isPublicPage = publicPages.includes(request.nextUrl.pathname)
    
    if (isPublicPage) {
      // If user is already logged in and is admin, redirect to dashboard
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .maybeSingle()

          if (userData?.role === 'admin') {
            return NextResponse.redirect(new URL('/admin', request.url))
          }
        } catch (error) {
          // Allow access to public pages even if there's an error
        }
      }
      return response
    }

    // For protected admin routes, check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Check if user is admin
    try {
      const { data: userData, error: queryError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (queryError || !userData) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      const role = userData.role?.toString().toLowerCase().trim()
      if (role !== 'admin') {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      return response
    } catch (error) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
