'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

type State = 'working' | 'ready' | 'error';

export default function SignupCompleteClient() {
  const searchParams = useSearchParams();
  const role = searchParams.get('type') === 'buyer' ? 'buyer' : 'seller';
  const [state, setState] = useState<State>('working');
  const [message, setMessage] = useState('Completing your Google signup...');
  const dashboardUrl = useMemo(() => role === 'buyer' ? '/buyer/dashboard' : '/seller/dashboard', [role]);

  useEffect(() => {
    let alive = true;

    async function completeSignup() {
      try {
        const code = searchParams.get('code');
        if (code) await supabase.auth.exchangeCodeForSession(code);

        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) {
          throw new Error('No Google session found. Try signing up again.');
        }

        const response = await fetch('/api/auth/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role }),
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Could not complete signup.');
        }

        if (!alive) return;
        setState('ready');
        setMessage('Your MuftahX account is ready. Opening your dashboard...');
        window.location.href = result.redirect || dashboardUrl;
      } catch (error) {
        if (!alive) return;
        setState('error');
        setMessage(error instanceof Error ? error.message : 'Signup could not be completed.');
      }
    }

    completeSignup();
    return () => { alive = false; };
  }, [dashboardUrl, role, searchParams]);

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.kicker}>Google signup</p>
        <h1 style={styles.h1}>{state === 'error' ? 'Signup needs attention.' : 'One account. One MuftahX identity.'}</h1>
        <p style={styles.text}>{message}</p>
        <div style={styles.actions}>
          {state === 'error' && <a href={`/api/auth/google?type=${role}`} style={styles.primary}>Try Google signup again</a>}
          <a href="/support" style={styles.secondary}>Go to support</a>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f8f7f2', color: '#171711', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif' },
  card: { maxWidth: 620, background: '#fff', border: '1px solid #e6e1d3', borderRadius: 8, padding: 32, boxShadow: '0 24px 70px rgba(0,0,0,.12)' },
  kicker: { color: '#b8841f', textTransform: 'uppercase', letterSpacing: '.14em', fontSize: 12, fontWeight: 900, margin: 0 },
  h1: { fontFamily: 'Georgia, serif', fontSize: 'clamp(36px, 6vw, 60px)', lineHeight: 1.02, margin: '14px 0 16px' },
  text: { color: '#45453e', fontSize: 17, lineHeight: 1.75 },
  actions: { display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 },
  primary: { background: '#1b4332', color: '#fff', textDecoration: 'none', borderRadius: 6, padding: '13px 18px', fontWeight: 900 },
  secondary: { background: '#f8f7f2', color: '#1b4332', textDecoration: 'none', border: '1px solid #e0dacb', borderRadius: 6, padding: '13px 18px', fontWeight: 900 },
};
