'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginClient() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });
    if (error || !data.session?.access_token) {
      setLoading(false);
      setMessage(error?.message || 'Login failed.');
      return;
    }
    const response = await fetch('/api/account/me', {
      headers: { Authorization: `Bearer ${data.session.access_token}` },
    });
    const result = await response.json();
    setLoading(false);
    window.location.href = result.redirect || '/support';
  };

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <Link href="/index.html" style={styles.back}>MuftahX home</Link>
        <p style={styles.kicker}>Account login</p>
        <h1 style={styles.h1}>Return to your MuftahX account.</h1>
        <p style={styles.text}>Use the password you created after Google signup, or continue with Google again.</p>

        <form onSubmit={login} style={styles.form}>
          <label style={styles.label}>
            Email
            <input style={styles.input} type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" />
          </label>
          <label style={styles.label}>
            Password
            <input style={styles.input} type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Your password" />
          </label>
          <button disabled={loading} style={styles.primary}>{loading ? 'Signing in...' : 'Login'}</button>
          {message && <p style={styles.error}>{message}</p>}
        </form>

        <div style={styles.divider}>or continue with Google</div>
        <div style={styles.actions}>
          <a href="/api/auth/google?type=seller" style={styles.secondary}>Seller Google login</a>
          <a href="/api/auth/google?type=buyer" style={styles.secondary}>Buyer Google login</a>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f8f7f2', color: '#171711', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif' },
  card: { width: '100%', maxWidth: 620, background: '#fff', border: '1px solid #e6e1d3', borderRadius: 8, padding: 32, boxShadow: '0 24px 70px rgba(0,0,0,.12)' },
  back: { color: '#1b4332', textDecoration: 'none', fontSize: 13, fontWeight: 900 },
  kicker: { color: '#b8841f', textTransform: 'uppercase', letterSpacing: '.14em', fontSize: 12, fontWeight: 900, margin: '28px 0 0' },
  h1: { fontFamily: 'Georgia, serif', fontSize: 'clamp(36px, 6vw, 58px)', lineHeight: 1.02, margin: '14px 0 12px' },
  text: { color: '#45453e', fontSize: 16, lineHeight: 1.7 },
  form: { display: 'grid', gap: 12, marginTop: 22 },
  label: { display: 'grid', gap: 7, color: '#5d4b24', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.08em' },
  input: { border: '1px solid #ded7c6', borderRadius: 6, padding: '12px 12px', fontSize: 14, color: '#171711', background: '#fbfaf6', textTransform: 'none', letterSpacing: 0, fontWeight: 500 },
  primary: { border: 0, background: '#1b4332', color: '#fff', borderRadius: 6, padding: '13px 16px', fontWeight: 900, cursor: 'pointer' },
  error: { color: '#b91c1c', fontSize: 13, fontWeight: 800, margin: 0 },
  divider: { color: '#777064', fontSize: 12, textAlign: 'center', margin: '20px 0 12px', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 800 },
  actions: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 },
  secondary: { textAlign: 'center', background: '#f8f7f2', color: '#1b4332', border: '1px solid #e0dacb', textDecoration: 'none', borderRadius: 6, padding: '12px 14px', fontWeight: 900 },
};
