import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

async function getGoogleUser(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return { error: 'Google session is required.' };
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user?.email) return { error: 'Google session could not be verified.' };
  return { user: data.user, email: data.user.email.toLowerCase().trim() };
}

export async function GET(req: NextRequest) {
  const session = await getGoogleUser(req);
  if (session.error || !session.email) {
    return NextResponse.json({ error: session.error }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('registrations')
    .select('*')
    .eq('email', session.email)
    .eq('type', 'seller')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, email: session.email });
}

export async function PATCH(req: NextRequest) {
  const session = await getGoogleUser(req);
  if (session.error || !session.email || !session.user) {
    return NextResponse.json({ error: session.error }, { status: 401 });
  }

  const body = await req.json();
  const updates = {
    type: 'seller',
    email: session.email,
    auth_user_id: session.user.id,
    signup_provider: 'google',
    company_name: String(body.company_name || '').trim() || null,
    contact_name: String(body.contact_name || '').trim() || null,
    category: String(body.category || '').trim() || null,
    country: String(body.country || '').trim() || null,
    compliance: String(body.compliance || '').trim() || null,
    document_ref: String(body.document_ref || '').trim() || null,
    export_capacity: String(body.export_capacity || '').trim() || null,
    document_status: String(body.document_ref || '').trim() ? 'pending' : 'reload_requested',
    status: 'new',
    notes: 'Seller updated profile from dashboard.',
  };

  const { data: existing } = await supabaseAdmin
    .from('registrations')
    .select('id')
    .eq('email', session.email)
    .eq('type', 'seller')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const query = existing
    ? supabaseAdmin.from('registrations').update(updates).eq('id', existing.id).select().single()
    : supabaseAdmin.from('registrations').insert(updates).select().single();

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, data });
}
