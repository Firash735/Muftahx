import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

type Role = 'seller' | 'buyer';

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    const body = await req.json().catch(() => ({}));
    const role: Role = body.role === 'buyer' ? 'buyer' : 'seller';

    if (!token) {
      return NextResponse.json({ error: 'Google session is required.' }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    const user = userData.user;
    if (userError || !user?.email) {
      return NextResponse.json({ error: 'Google session could not be verified.' }, { status: 401 });
    }

    const email = user.email.toLowerCase().trim();
    const fullName = String(user.user_metadata?.full_name || user.user_metadata?.name || '').trim() || null;

    const { data: account, error: accountError } = await supabaseAdmin
      .from('platform_accounts')
      .upsert({
        auth_user_id: user.id,
        email,
        full_name: fullName,
        role,
        signup_provider: 'google',
        status: 'active',
        last_login_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' })
      .select()
      .single();

    if (accountError) {
      return NextResponse.json({ error: accountError.message }, { status: 500 });
    }

    const { data: existingRegistration } = await supabaseAdmin
      .from('registrations')
      .select('id')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!existingRegistration) {
      await supabaseAdmin.from('registrations').insert({
        type: role,
        email,
        contact_name: fullName,
        auth_user_id: user.id,
        signup_provider: 'google',
        document_status: role === 'seller' ? 'pending' : null,
        fraud_score: 0,
        status: 'new',
        notes: 'Created from Google signup. User should complete profile after login.',
      });
    }

    return NextResponse.json({
      success: true,
      account,
      redirect: role === 'buyer' ? '/buyer/dashboard' : '/seller/dashboard',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Signup completion failed.' }, { status: 500 });
  }
}
