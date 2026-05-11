'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PasswordSetup from '@/app/account/PasswordSetup';

type UserState = { email: string | null; token: string | null; loading: boolean };
type BuyerRequest = {
  id: string;
  company_name: string | null;
  country: string | null;
  product_interest: string;
  volume: string | null;
  destination_market: string | null;
  timeline: string | null;
  certification_need: string | null;
  status: string;
};

const emptyRequest = {
  company_name: '',
  country: '',
  product_interest: '',
  volume: '',
  destination_market: '',
  timeline: '',
  certification_need: '',
  notes: '',
};

export default function BuyerDashboard() {
  const [user, setUser] = useState<UserState>({ email: null, token: null, loading: true });
  const [request, setRequest] = useState(emptyRequest);
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 3500);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser({
        email: data.session?.user.email || null,
        token: data.session?.access_token || null,
        loading: false,
      });
    });
  }, []);

  useEffect(() => {
    if (!user.token) return;
    fetch('/api/buyer/requests', { headers: { Authorization: `Bearer ${user.token}` } })
      .then(r => r.json())
      .then(result => {
        if (result.data) setRequests(result.data);
      });
  }, [user.token]);

  const submitRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user.token) return;
    setSaving(true);
    const response = await fetch('/api/buyer/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      body: JSON.stringify(request),
    });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) {
      showToast(result.error || 'Request could not be saved.');
      return;
    }
    setRequests(prev => [result.data, ...prev]);
    setRequest(emptyRequest);
    showToast('Supplier match request saved. Admin can now review and match verified sellers.');
  };

  if (user.loading) return <main style={styles.page}><section style={styles.card}>Loading buyer dashboard...</section></main>;
  if (!user.email) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <p style={styles.kicker}>Buyer access</p>
          <h1 style={styles.h1}>Sign in with Google to unlock buyer tools.</h1>
          <p style={styles.text}>Visitors can learn publicly. Registered buyers get saved sourcing context, stronger support, and cleaner supplier inquiries.</p>
          <a href="/api/auth/google?type=buyer" style={styles.primary}>Continue with Google</a>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      {toast && <div style={styles.toast}>{toast}</div>}
      <section style={styles.hero}>
        <Link href="/index.html" style={styles.nav}>MuftahX home</Link>
        <p style={styles.kicker}>Buyer dashboard</p>
        <h1 style={styles.h1}>Request verified Kenyan suppliers with proof.</h1>
        <p style={styles.text}>Signed in as {user.email}. Submit sourcing requests, save your requirements, and use AI support for sharper buyer questions.</p>
      </section>

      <section style={styles.statusRow}>
        <div style={styles.statusCard}><span>Requests</span><strong>{requests.length}</strong></div>
        <div style={styles.statusCard}><span>Access</span><strong>buyer</strong></div>
        <div style={styles.statusCard}><span>Supplier data</span><strong>gated</strong></div>
      </section>

      <section style={styles.passwordWrap}>
        <PasswordSetup />
      </section>

      <section style={styles.layout}>
        <form onSubmit={submitRequest} style={styles.panel}>
          <h2 style={styles.h2}>Request supplier match</h2>
          <p style={styles.textSmall}>Tell MuftahX what you need. Admin can use this to match you with verified sellers instead of random public listings.</p>
          <div style={styles.formGrid}>
            <Field label="Company name" value={request.company_name} onChange={v => setRequest(p => ({ ...p, company_name: v }))} />
            <Field label="Country" value={request.country} onChange={v => setRequest(p => ({ ...p, country: v }))} />
            <Field label="Product needed" value={request.product_interest} onChange={v => setRequest(p => ({ ...p, product_interest: v }))} placeholder="Hass avocado, AA coffee, tea..." />
            <Field label="Volume" value={request.volume} onChange={v => setRequest(p => ({ ...p, volume: v }))} placeholder="Example: 1 container/month" />
            <Field label="Destination market" value={request.destination_market} onChange={v => setRequest(p => ({ ...p, destination_market: v }))} placeholder="UAE, Netherlands, Pakistan..." />
            <Field label="Timeline" value={request.timeline} onChange={v => setRequest(p => ({ ...p, timeline: v }))} placeholder="This month, Q3, recurring..." />
            <Field label="Certification needed" value={request.certification_need} onChange={v => setRequest(p => ({ ...p, certification_need: v }))} placeholder="KEPHIS, GlobalGAP, FDA..." />
          </div>
          <label style={styles.label}>
            Notes for MuftahX
            <textarea style={styles.textarea} value={request.notes} onChange={event => setRequest(p => ({ ...p, notes: event.target.value }))} placeholder="Product specs, grade, packaging, budget, delivery expectations..." />
          </label>
          <button disabled={saving} style={styles.primaryBtn}>{saving ? 'Saving...' : 'Save sourcing request'}</button>
        </form>

        <section style={styles.panel}>
          <h2 style={styles.h2}>Buyer support actions</h2>
          <p style={styles.textSmall}>Use these next steps after saving your sourcing request.</p>
          <div style={styles.actions}>
            <Link href="/products" style={styles.actionBtn}>Browse product pages</Link>
            <Link href="/support" style={styles.actionBtn}>Ask AI support</Link>
            <Link href="/knowledge" style={styles.actionBtn}>Read export guides</Link>
          </div>
          <div style={styles.noteBox}>
            <strong>What stays private:</strong>
            <span>Direct supplier contacts, private certificates, and admin fraud notes are not public. Buyers get summaries first, then deeper access after review.</span>
          </div>
        </section>
      </section>

      <section style={styles.requestsPanel}>
        <h2 style={styles.h2}>Your sourcing requests</h2>
        {requests.length === 0 ? (
          <p style={styles.textSmall}>No buyer requests saved yet. Add one above so MuftahX can understand your demand.</p>
        ) : (
          <div style={styles.requestList}>
            {requests.map(item => (
              <article key={item.id} style={styles.requestCard}>
                <strong>{item.product_interest}</strong>
                <span>{item.country || 'No country'} · {item.volume || 'No volume'} · {item.destination_market || 'No market'}</span>
                <span>{item.certification_need || 'No certification listed'} · {item.timeline || 'No timeline'}</span>
                <em>{item.status}</em>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Field(props: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label style={styles.label}>
      {props.label}
      <input style={styles.input} value={props.value} onChange={event => props.onChange(event.target.value)} placeholder={props.placeholder || props.label} />
    </label>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f8f7f2', color: '#171711', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif' },
  hero: { maxWidth: 1100, margin: '0 auto', padding: '48px 24px 20px' },
  nav: { color: '#1b4332', textDecoration: 'none', fontSize: 13, fontWeight: 900 },
  card: { maxWidth: 680, margin: '12vh auto', background: '#fff', border: '1px solid #e6e1d3', borderRadius: 8, padding: 32 },
  kicker: { color: '#b8841f', textTransform: 'uppercase', letterSpacing: '.14em', fontSize: 12, fontWeight: 900, margin: '34px 0 0' },
  h1: { fontFamily: 'Georgia, serif', fontSize: 'clamp(38px, 6vw, 68px)', lineHeight: 1.02, margin: '14px 0 16px', maxWidth: 850 },
  h2: { fontFamily: 'Georgia, serif', fontSize: 30, margin: '0 0 10px' },
  text: { color: '#45453e', fontSize: 17, lineHeight: 1.75, maxWidth: 780 },
  textSmall: { color: '#45453e', fontSize: 14, lineHeight: 1.7 },
  primary: { display: 'inline-block', marginTop: 16, background: '#1b4332', color: '#fff', textDecoration: 'none', borderRadius: 6, padding: '13px 18px', fontWeight: 900 },
  statusRow: { maxWidth: 1100, margin: '0 auto', padding: '0 24px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 },
  statusCard: { background: '#fff', border: '1px solid #e6e1d3', borderRadius: 8, padding: 16, display: 'grid', gap: 6 },
  passwordWrap: { padding: '0 24px 16px' },
  layout: { maxWidth: 1100, margin: '0 auto', padding: '0 24px 18px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 16 },
  panel: { background: '#fff', border: '1px solid #e6e1d3', borderRadius: 8, padding: 22 },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12, marginTop: 16 },
  label: { display: 'grid', gap: 7, color: '#5d4b24', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 12 },
  input: { border: '1px solid #ded7c6', borderRadius: 6, padding: '12px 12px', fontSize: 14, color: '#171711', background: '#fbfaf6', textTransform: 'none', letterSpacing: 0, fontWeight: 500 },
  textarea: { border: '1px solid #ded7c6', borderRadius: 6, padding: '12px 12px', fontSize: 14, color: '#171711', background: '#fbfaf6', minHeight: 100, resize: 'vertical' },
  primaryBtn: { marginTop: 16, border: 0, background: '#1b4332', color: '#fff', borderRadius: 6, padding: '13px 16px', fontWeight: 900, cursor: 'pointer' },
  actions: { display: 'grid', gap: 10, marginTop: 16 },
  actionBtn: { background: '#f8f7f2', color: '#1b4332', border: '1px solid #e0dacb', textDecoration: 'none', borderRadius: 6, padding: '12px 14px', fontWeight: 900 },
  noteBox: { marginTop: 18, borderTop: '1px solid #ece7d8', paddingTop: 14, display: 'grid', gap: 6, color: '#45453e', fontSize: 14, lineHeight: 1.6 },
  requestsPanel: { maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' },
  requestList: { display: 'grid', gap: 10, marginTop: 14 },
  requestCard: { background: '#fff', border: '1px solid #e6e1d3', borderRadius: 8, padding: 16, display: 'grid', gap: 5 },
  toast: { position: 'fixed', top: 16, right: 16, zIndex: 20, background: '#1b4332', color: '#fff', borderRadius: 8, padding: '12px 16px', fontSize: 13, fontWeight: 800, boxShadow: '0 18px 50px rgba(0,0,0,.18)' },
};
