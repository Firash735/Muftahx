import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return NextResponse.json({ error: 'Login session is required.' }, { status: 401 });

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  const user = userData.user;
  if (userError || !user?.email) {
    return NextResponse.json({ error: 'Login session could not be verified.' }, { status: 401 });
  }

  const email = user.email.toLowerCase().trim();
  const { data: account } = await supabaseAdmin
    .from('platform_accounts')
    .select('email, role, status, full_name')
    .eq('email', email)
    .maybeSingle();

  return NextResponse.json({
    email,
    account,
    redirect: account?.role === 'buyer' ? '/buyer/dashboard' : account?.role === 'seller' ? '/seller/dashboard' : '/support',
  });
}
