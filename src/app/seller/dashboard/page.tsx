'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type UserState = { email: string | null; loading: boolean };

export default function SellerDashboard() {
  const [user, setUser] = useState<UserState>({ email: null, loading: true });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser({ email: data.user?.email || null, loading: false });
    });
  }, []);

  if (user.loading) return <main style={styles.page}><section style={styles.card}>Loading seller dashboard...</section></main>;
  if (!user.email) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <p style={styles.kicker}>Seller access</p>
          <h1 style={styles.h1}>Sign in with Google to start seller verification.</h1>
          <p style={styles.text}>Public visitors can learn. Registered sellers get document guidance, product listing steps, and admin verification status.</p>
          <a href="/api/auth/google?type=seller" style={styles.primary}>Continue with Google</a>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <Link href="/index.html" style={styles.nav}>MuftahX home</Link>
        <p style={styles.kicker}>Seller dashboard</p>
        <h1 style={styles.h1}>Prepare your company for verified buyer visibility.</h1>
        <p style={styles.text}>Signed in as {user.email}. This dashboard is where seller profile completion, document reloads, product listings, and buyer inquiries should live.</p>
      </section>
      <section style={styles.grid}>
        {[
          ['Profile readiness', 'Complete company name, contact person, product category, country, and export capacity.'],
          ['Document verification', 'Upload certificate references and reload documents when admin requests clearer proof.'],
          ['Product listing', 'Add photos, grades, volumes, packaging, destination readiness, and market-fit notes.'],
          ['Deal support', 'Use AI support for pricing, negotiation, buyer questions, and export workflow preparation.'],
        ].map(([title, text]) => (
          <article key={title} style={styles.tile}>
            <h2 style={styles.h2}>{title}</h2>
            <p style={styles.textSmall}>{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f8f7f2', color: '#171711', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif' },
  hero: { maxWidth: 1100, margin: '0 auto', padding: '48px 24px 20px' },
  nav: { color: '#1b4332', textDecoration: 'none', fontSize: 13, fontWeight: 900 },
  card: { maxWidth: 680, margin: '12vh auto', background: '#fff', border: '1px solid #e6e1d3', borderRadius: 8, padding: 32 },
  kicker: { color: '#b8841f', textTransform: 'uppercase', letterSpacing: '.14em', fontSize: 12, fontWeight: 900, margin: '34px 0 0' },
  h1: { fontFamily: 'Georgia, serif', fontSize: 'clamp(38px, 6vw, 68px)', lineHeight: 1.02, margin: '14px 0 16px', maxWidth: 850 },
  h2: { fontFamily: 'Georgia, serif', fontSize: 28, margin: '0 0 10px' },
  text: { color: '#45453e', fontSize: 17, lineHeight: 1.75, maxWidth: 760 },
  textSmall: { color: '#45453e', fontSize: 14, lineHeight: 1.7 },
  primary: { display: 'inline-block', marginTop: 16, background: '#1b4332', color: '#fff', textDecoration: 'none', borderRadius: 6, padding: '13px 18px', fontWeight: 900 },
  grid: { maxWidth: 1100, margin: '0 auto', padding: '0 24px 72px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 },
  tile: { background: '#fff', border: '1px solid #e6e1d3', borderRadius: 8, padding: 22 },
};
