





import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from './app/lib/auth';

// Public routes (no authentication needed)
const publicRoutes = [
  '/admin/login',
  '/login',
  '/',
  '/unauthorized',
  '/admin/reset-password'
];

// Public routes that start with specific patterns (for reset-password)
const publicRoutePatterns = [
  '/admin/reset-password'  // This will match /admin/reset-password and any variations
];

// API routes that don't need authentication
const publicApiRoutes = [
  '/api/admin/login',
  '/api/admin/forgot-password',
  '/api/admin/session',
  '/api/admin/reset-password',
];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if it's a public API route
  const isPublicApiRoute = publicApiRoutes.some(route =>
    path.startsWith(route)
  );

  // Check if it's a public page route (exact match or pattern match)
  const isExactPublicRoute = publicRoutes.includes(path);
  const isPatternPublicRoute = publicRoutePatterns.some(pattern =>
    path.startsWith(pattern)
  );
  const isPublicRoute = isExactPublicRoute || isPatternPublicRoute;

  // Get admin session
  const session = await getAdminSession();



  console.log("admin data",session)

  // Allow access to public API routes
  if (isPublicApiRoute) {
    return NextResponse.next();
  }

  // Handle root path redirect
  if (path === "/" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow access to public pages
  if (isPublicRoute) {
    // If user is logged in and trying to access login page, redirect to dashboard
    if ((path === '/admin/login' || path === '/login') && session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Check if user is trying to access admin routes
  // First check if it's NOT a public route pattern
  const isAdminProtectedRoute = !isPatternPublicRoute && (
    path.startsWith('/admin') ||
    path.startsWith('/dashboard') ||
    path.startsWith('/orders') ||
    path.startsWith('/labours') ||
    path.startsWith('/agent-requirements') ||
    path.startsWith('/postings') ||
    path.startsWith('/farmers') ||
    path.startsWith('/agents') ||
    path.startsWith('/sub-admins') ||
    path.startsWith('/slider') ||
    path.startsWith('/categories') ||
    path.startsWith('/cropcare') ||
    path.startsWith('/admin-advertisement') ||
    path.startsWith('/adminnotes') ||
    path.startsWith('/menuicon') ||
    path.startsWith('/breed-options') ||
    path.startsWith('/cattle-options') ||
    path.startsWith('/quantity-options') ||
    path.startsWith('/acres') ||
    path.startsWith('/seeds') ||
    path.startsWith('/settings') ||
    path.startsWith('/states') ||
    path.startsWith('/district') ||
    path.startsWith('/taluka') ||
    path.startsWith('/my-profile')||
    path.startsWith('/cropcare-orders')||
    path.startsWith('/admintofarmerpayment-report')||
        path.startsWith('/admin-notifications')
  );

  // If accessing admin/protected routes without session, redirect to admin login
  if (isAdminProtectedRoute && !session) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }


  if (path.startsWith('/my-profile') && session) {
  return NextResponse.next();

}

  
  if (path.startsWith('/admin-notifications') && session) {
  return NextResponse.next();
  }
  // For subadmin, check page access (only for admin protected routes)
  if (isAdminProtectedRoute && session?.admin?.role === 'subadmin') {
    // Extract page name from path
    const pagePath = path.split('/')[1] || 'dashboard';
    const pageName = pagePath.toLowerCase();

    // Special cases mapping
    const pageMapping: Record<string, string> = {
      '': 'dashboard',
      'dashboard': 'dashboard',
      'agent-requirements': 'agent requirement',
      'sub-admins': 'sub admins',
      'admin-advertisement': 'post ads',
      'adminnotes': 'add notes',
      'menuicon': 'menu icons',
      'breed-options': 'breed options',
      'cattle-options': 'cattle options',
      'quantity-options': 'quantity options',
      'my-profile': 'my profile',
      'postings': 'crop postings',  // Map /postings to "Crop Postings"
      'cropcare': 'crop care',
      'cropcare-orders':'crop care orders',
      'admintofarmerpayment-report':'admin to farmer payment',
      'taluka':'taluk',
      'orders-details':'farmer trans management',
      'admin-notifications':'admin notifications'
    };

    const mappedPageName = pageMapping[pageName] || pageName.replace('-', ' ');

    const hasAccess = session.admin.pageAccess.some((access: string) => {
      const normalizedAccess = access.toLowerCase().trim();
      const normalizedPage = mappedPageName.toLowerCase().trim();
      return normalizedAccess === normalizedPage;
    });

    if (!hasAccess) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

// Also export as default
export default proxy;