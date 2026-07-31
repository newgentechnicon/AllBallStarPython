import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function getSafeRedirectPath(next: string | null) {
  return next?.startsWith('/') && !next.startsWith('//')
    ? next
    : '/reset-password';
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const next = getSafeRedirectPath(request.nextUrl.searchParams.get('next'));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.redirect(
    new URL('/login?error=recovery_link_invalid', request.url)
  );
}
