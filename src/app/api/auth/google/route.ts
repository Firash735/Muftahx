import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type') === 'buyer' ? 'buyer' : 'seller';
  const redirectTo = `${req.nextUrl.origin}/index.html?signup=${type}&google=1`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });

  if (error || !data.url) {
    return NextResponse.json({
      error: 'Google signup is not configured yet. Enable Google provider in Supabase Auth settings.',
    }, { status: 500 });
  }

  return NextResponse.redirect(data.url);
}
