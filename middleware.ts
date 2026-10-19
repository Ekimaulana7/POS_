import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from './lib/utils';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('pos_session')?.value;
  const path = request.nextUrl.pathname;

  if (!token && path !== '/login') return NextResponse.redirect(new URL('/login', request.url));
  
  if (token) {
    try {
      const session = await decrypt(token);
      if (path === '/login') return NextResponse.redirect(new URL(session.role === 'admin' ? '/admin' : '/cashier', request.url));
      if (path.startsWith('/admin') && session.role !== 'admin') return NextResponse.redirect(new URL('/cashier', request.url));
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ['/', '/admin/:path*', '/cashier/:path*', '/login'] };

