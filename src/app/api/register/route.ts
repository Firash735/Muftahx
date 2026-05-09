import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const DISALLOWED_PERSONAL_DOMAINS = new Set([
  'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'proton.me', 'protonmail.com',
]);

const DISPOSABLE_HINTS = ['mailinator', 'tempmail', '10minutemail', 'guerrillamail', 'yopmail'];

function assessRegistration(body: Record<string, unknown>, email: string) {
  const flags: string[] = [];
  const domain = email.split('@')[1] || '';
  const company = String(body.company_name || '').trim();
  const compliance = String(body.compliance || '');
  const documentRef = String(body.document_ref || '').trim();

  if (DISPOSABLE_HINTS.some(hint => domain.includes(hint))) flags.push('Disposable email domain');
  if (DISALLOWED_PERSONAL_DOMAINS.has(domain)) flags.push('Use a business domain or Gmail account');
  if (body.type === 'seller' && !company) flags.push('Missing company name');
  if (body.type === 'seller' && compliance.toLowerCase().includes('still getting certified')) flags.push('No verified certificate selected');
  if (body.type === 'seller' && !documentRef) flags.push('Missing certificate number or upload link');
  if (company && /test|demo|fake|none|n\/a/i.test(company)) flags.push('Suspicious company name');

  const fraudScore = Math.min(flags.length * 25, 100);
  const rejected = fraudScore >= 50;

  return {
    documentRef: documentRef || null,
    documentStatus: rejected ? 'reload_requested' : 'pending',
    fraudScore,
    fraudFlags: flags.join('; ') || null,
    status: rejected ? 'rejected' : 'new',
    rejectionReason: rejected ? 'Automatic review: ' + flags.join('; ') : null,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, email, company_name, contact_name, country, category, compliance, sourcing } = body;

    if (!email || !type) {
      return NextResponse.json({ error: 'Email and type are required.' }, { status: 400 });
    }
    const cleanEmail = email.toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }
    if (!['seller', 'buyer'].includes(type)) {
      return NextResponse.json({ error: 'Invalid account type.' }, { status: 400 });
    }

    const review = assessRegistration(body, cleanEmail);

    const { data, error } = await supabaseAdmin
      .from('registrations')
      .insert({
        type,
        email:        cleanEmail,
        company_name: company_name?.trim() || null,
        contact_name: contact_name?.trim() || null,
        country:      country  || null,
        category:     category || null,
        compliance:   compliance || null,
        sourcing:     sourcing   || null,
        document_ref: review.documentRef,
        document_status: review.documentStatus,
        fraud_score: review.fraudScore,
        fraud_flags: review.fraudFlags,
        rejection_reason: review.rejectionReason,
        status:       review.status,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error.message);
      return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: review.status === 'rejected'
        ? 'Registration received, but verification needs clearer documents. Please reload a valid certificate number or upload link.'
        : type === 'seller'
        ? 'Registration received! We will contact you within 24 hours at ' + email + ' to complete verification.'
        : 'Welcome! You now have access to browse verified Kenyan suppliers. Check your email.',
      id: data.id,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
