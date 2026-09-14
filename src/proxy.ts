import { type NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

// Ensure the proxy only runs on necessary routes
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.png$|assets).*)',
  ],
};
