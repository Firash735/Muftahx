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
    .from('buyer_requests')
    .select('*')
    .eq('buyer_email', session.email)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const session = await getGoogleUser(req);
  if (session.error || !session.email || !session.user) {
    return NextResponse.json({ error: session.error }, { status: 401 });
  }

  const body = await req.json();
  const productInterest = String(body.product_interest || '').trim();
  if (!productInterest) {
    return NextResponse.json({ error: 'Product interest is required.' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('buyer_requests')
    .insert({
      buyer_email: session.email,
      auth_user_id: session.user.id,
      company_name: String(body.company_name || '').trim() || null,
      country: String(body.country || '').trim() || null,
      product_interest: productInterest,
      volume: String(body.volume || '').trim() || null,
      destination_market: String(body.destination_market || '').trim() || null,
      timeline: String(body.timeline || '').trim() || null,
      certification_need: String(body.certification_need || '').trim() || null,
      notes: String(body.notes || '').trim() || null,
      status: 'new',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}
