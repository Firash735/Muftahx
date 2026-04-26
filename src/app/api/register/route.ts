import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, email, company_name, contact_name, country, category, compliance, sourcing } = body;

    if (!email || !type) {
      return NextResponse.json({ error: 'Email and type are required.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('registrations')
      .insert({
        type,
        email:        email.toLowerCase().trim(),
        company_name: company_name?.trim() || null,
        contact_name: contact_name?.trim() || null,
        country:      country  || null,
        category:     category || null,
        compliance:   compliance || null,
        sourcing:     sourcing   || null,
        status:       'new',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error.message);
      return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: type === 'seller'
        ? 'Registration received! We will contact you within 24 hours at ' + email + ' to complete verification.'
        : 'Welcome! You now have access to browse verified Kenyan suppliers. Check your email.',
      id: data.id,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
