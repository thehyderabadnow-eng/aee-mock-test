// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for the session cookie/token (Simplified example)
  const session = request.cookies.get('sb-access-token'); // Supabase stores session here

  // If trying to access dashboard/exam without session, redirect to login
  if (!session && (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/exam'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}