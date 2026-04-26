import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'muftahx_dev_secret_change_me';

function auth(req: NextRequest): boolean {
  const token = req.cookies.get('mx_token')?.value;
  if (!token) return false;
  try {
    const d = jwt.verify(token, JWT_SECRET) as { role: string };
    return d.role === 'admin';
  } catch { return false; }
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resource = new URL(req.url).searchParams.get('resource') || 'stats';

  if (resource === 'stats') {
    const [a, b, c, d] = await Promise.all([
      supabaseAdmin.from('registrations').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('registrations').select('*', { count: 'exact', head: true }).eq('type', 'seller'),
      supabaseAdmin.from('registrations').select('*', { count: 'exact', head: true }).eq('type', 'buyer'),
      supabaseAdmin.from('exporters').select('*', { count: 'exact', head: true }),
    ]);
    return NextResponse.json({ total: a.count||0, sellers: b.count||0, buyers: c.count||0, exporters: d.count||0 });
  }

  if (resource === 'registrations') {
    const { data, error } = await supabaseAdmin
      .from('registrations').select('*').order('created_at', { ascending: false }).limit(500);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  if (resource === 'exporters') {
    const { data, error } = await supabaseAdmin
      .from('exporters').select('*').order('data_score', { ascending: false }).limit(500);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  return NextResponse.json({ error: 'Unknown resource' }, { status: 400 });
}

export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, table, updates } = await req.json();
  const { data, error } = await supabaseAdmin.from(table).update(updates).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}
