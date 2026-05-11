'use client';

import { FormEvent, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function PasswordSetup() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const savePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    if (password.length < 10) {
      setMessage('Use at least 10 characters.');
      return;
    }
    if (password !== confirm) {
      setMessage('Passwords do not match.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setPassword('');
    setConfirm('');
    setMessage('Password created. Next time you can log in with email and password.');
  };

  return (
    <form onSubmit={savePassword} style={styles.panel}>
      <h2 style={styles.h2}>Create your login password</h2>
      <p style={styles.text}>Google creates your identity first. A password lets you return later from the Login page using your email and password.</p>
      <div style={styles.grid}>
        <label style={styles.label}>
          Password
          <input style={styles.input} type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Minimum 10 characters" />
        </label>
        <label style={styles.label}>
          Confirm password
          <input style={styles.input} type="password" value={confirm} onChange={event => setConfirm(event.target.value)} placeholder="Repeat password" />
        </label>
      </div>
      <button disabled={saving} style={styles.button}>{saving ? 'Saving...' : 'Create password'}</button>
      {message && <p style={styles.message}>{message}</p>}
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  panel: { background: '#fff', border: '1px solid #e6e1d3', borderRadius: 8, padding: 22, maxWidth: 1100, margin: '0 auto 16px' },
  h2: { fontFamily: 'Georgia, serif', fontSize: 30, margin: '0 0 10px', color: '#171711' },
  text: { color: '#45453e', fontSize: 14, lineHeight: 1.7, maxWidth: 740 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 14 },
  label: { display: 'grid', gap: 7, color: '#5d4b24', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.08em' },
  input: { border: '1px solid #ded7c6', borderRadius: 6, padding: '12px 12px', fontSize: 14, color: '#171711', background: '#fbfaf6', textTransform: 'none', letterSpacing: 0, fontWeight: 500 },
  button: { marginTop: 16, border: 0, background: '#1b4332', color: '#fff', borderRadius: 6, padding: '13px 16px', fontWeight: 900, cursor: 'pointer' },
  message: { color: '#1b4332', fontSize: 13, fontWeight: 800, margin: '12px 0 0' },
};
