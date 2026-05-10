'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type UserState = { email: string | null; token: string | null; loading: boolean };
type Profile = {
  company_name: string;
  contact_name: string;
  category: string;
  country: string;
  compliance: string;
  document_ref: string;
  export_capacity: string;
  document_status?: string;
  status?: string;
};
type Product = {
  id: string;
  product_name: string;
  category: string | null;
  grade: string | null;
  volume: string | null;
  destination_market: string | null;
  status: string;
};

const emptyProfile: Profile = {
  company_name: '',
  contact_name: '',
  category: '',
  country: '',
  compliance: '',
  document_ref: '',
  export_capacity: '',
};

const emptyProduct = {
  product_name: '',
  category: '',
  grade: '',
  volume: '',
  packaging: '',
  destination_market: '',
  photo_url: '',
};

export default function SellerDashboard() {
  const [user, setUser] = useState<UserState>({ email: null, token: null, loading: true });
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [product, setProduct] = useState(emptyProduct);
  const [products, setProducts] = useState<Product[]>([]);
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
    const headers = { Authorization: `Bearer ${user.token}` };
    Promise.all([
      fetch('/api/seller/profile', { headers }).then(r => r.json()),
      fetch('/api/seller/products', { headers }).then(r => r.json()),
    ]).then(([profileResult, productResult]) => {
      if (profileResult.data) {
        setProfile({
          company_name: profileResult.data.company_name || '',
          contact_name: profileResult.data.contact_name || '',
          category: profileResult.data.category || '',
          country: profileResult.data.country || '',
          compliance: profileResult.data.compliance || '',
          document_ref: profileResult.data.document_ref || '',
          export_capacity: profileResult.data.export_capacity || '',
          document_status: profileResult.data.document_status || 'pending',
          status: profileResult.data.status || 'new',
        });
      }
      if (productResult.data) setProducts(productResult.data);
    });
  }, [user.token]);

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user.token) return;
    setSaving(true);
    const response = await fetch('/api/seller/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      body: JSON.stringify(profile),
    });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) {
      showToast(result.error || 'Profile could not be saved.');
      return;
    }
    setProfile(prev => ({ ...prev, document_status: result.data.document_status, status: result.data.status }));
    showToast('Seller profile saved. Admin can now review your update.');
  };

  const submitProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user.token) return;
    setSaving(true);
    const response = await fetch('/api/seller/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      body: JSON.stringify(product),
    });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) {
      showToast(result.error || 'Product could not be saved.');
      return;
    }
    setProducts(prev => [result.data, ...prev]);
    setProduct(emptyProduct);
    showToast('Product submitted for admin review.');
  };

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
      {toast && <div style={styles.toast}>{toast}</div>}
      <section style={styles.hero}>
        <Link href="/index.html" style={styles.nav}>MuftahX home</Link>
        <p style={styles.kicker}>Seller dashboard</p>
        <h1 style={styles.h1}>Prepare your company for verified buyer visibility.</h1>
        <p style={styles.text}>Signed in as {user.email}. Save your profile, reload documents, and submit products for admin review.</p>
      </section>

      <section style={styles.statusRow}>
        <div style={styles.statusCard}><span>Account</span><strong>{profile.status || 'new'}</strong></div>
        <div style={styles.statusCard}><span>Documents</span><strong>{profile.document_status || 'pending'}</strong></div>
        <div style={styles.statusCard}><span>Products</span><strong>{products.length}</strong></div>
      </section>

      <section style={styles.layout}>
        <form onSubmit={saveProfile} style={styles.panel}>
          <h2 style={styles.h2}>Profile readiness</h2>
          <p style={styles.textSmall}>Complete this first. Admin uses it to verify whether your company is ready for buyer visibility.</p>
          <div style={styles.formGrid}>
            <Field label="Company name" value={profile.company_name} onChange={v => setProfile(p => ({ ...p, company_name: v }))} />
            <Field label="Contact person" value={profile.contact_name} onChange={v => setProfile(p => ({ ...p, contact_name: v }))} />
            <Field label="Export category" value={profile.category} onChange={v => setProfile(p => ({ ...p, category: v }))} />
            <Field label="Country" value={profile.country} onChange={v => setProfile(p => ({ ...p, country: v }))} />
            <Field label="Export capacity" value={profile.export_capacity} onChange={v => setProfile(p => ({ ...p, export_capacity: v }))} placeholder="Example: 5 MT/week" />
            <Field label="Compliance documents" value={profile.compliance} onChange={v => setProfile(p => ({ ...p, compliance: v }))} placeholder="KEPHIS, GlobalGAP, AFA/HCD..." />
          </div>
          <label style={styles.label}>
            Certificate number or upload link
            <input style={styles.input} value={profile.document_ref} onChange={event => setProfile(p => ({ ...p, document_ref: event.target.value }))} placeholder="KEPHIS-2026-001 or Google Drive link" />
          </label>
          <button disabled={saving} style={styles.primaryBtn}>{saving ? 'Saving...' : 'Save profile and documents'}</button>
        </form>

        <form onSubmit={submitProduct} style={styles.panel}>
          <h2 style={styles.h2}>Product listing</h2>
          <p style={styles.textSmall}>Submit one product at a time. Admin reviews before it becomes visible to buyers.</p>
          <div style={styles.formGrid}>
            <Field label="Product name" value={product.product_name} onChange={v => setProduct(p => ({ ...p, product_name: v }))} placeholder="Hass avocado, AA coffee..." />
            <Field label="Category" value={product.category} onChange={v => setProduct(p => ({ ...p, category: v }))} />
            <Field label="Grade" value={product.grade} onChange={v => setProduct(p => ({ ...p, grade: v }))} placeholder="Grade 1, AA, export grade..." />
            <Field label="Volume" value={product.volume} onChange={v => setProduct(p => ({ ...p, volume: v }))} placeholder="2 MT/week" />
            <Field label="Packaging" value={product.packaging} onChange={v => setProduct(p => ({ ...p, packaging: v }))} placeholder="4kg cartons, 60kg bags..." />
            <Field label="Destination market" value={product.destination_market} onChange={v => setProduct(p => ({ ...p, destination_market: v }))} placeholder="UAE, EU, Pakistan..." />
          </div>
          <label style={styles.label}>
            Product photo URL
            <input style={styles.input} value={product.photo_url} onChange={event => setProduct(p => ({ ...p, photo_url: event.target.value }))} placeholder="https://..." />
          </label>
          <button disabled={saving} style={styles.primaryBtn}>{saving ? 'Submitting...' : 'Submit product for review'}</button>
        </form>
      </section>

      <section style={styles.productsPanel}>
        <h2 style={styles.h2}>Your submitted products</h2>
        {products.length === 0 ? (
          <p style={styles.textSmall}>No products submitted yet. Add your first product above.</p>
        ) : (
          <div style={styles.productList}>
            {products.map(item => (
              <article key={item.id} style={styles.productCard}>
                <strong>{item.product_name}</strong>
                <span>{item.category || 'No category'} · {item.volume || 'No volume'} · {item.destination_market || 'No market'}</span>
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
  text: { color: '#45453e', fontSize: 17, lineHeight: 1.75, maxWidth: 760 },
  textSmall: { color: '#45453e', fontSize: 14, lineHeight: 1.7 },
  primary: { display: 'inline-block', marginTop: 16, background: '#1b4332', color: '#fff', textDecoration: 'none', borderRadius: 6, padding: '13px 18px', fontWeight: 900 },
  statusRow: { maxWidth: 1100, margin: '0 auto', padding: '0 24px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 },
  statusCard: { background: '#fff', border: '1px solid #e6e1d3', borderRadius: 8, padding: 16, display: 'grid', gap: 6 },
  layout: { maxWidth: 1100, margin: '0 auto', padding: '0 24px 18px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 16 },
  panel: { background: '#fff', border: '1px solid #e6e1d3', borderRadius: 8, padding: 22 },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12, marginTop: 16 },
  label: { display: 'grid', gap: 7, color: '#5d4b24', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 12 },
  input: { border: '1px solid #ded7c6', borderRadius: 6, padding: '12px 12px', fontSize: 14, color: '#171711', background: '#fbfaf6', textTransform: 'none', letterSpacing: 0, fontWeight: 500 },
  primaryBtn: { marginTop: 16, border: 0, background: '#1b4332', color: '#fff', borderRadius: 6, padding: '13px 16px', fontWeight: 900, cursor: 'pointer' },
  productsPanel: { maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' },
  productList: { display: 'grid', gap: 10, marginTop: 14 },
  productCard: { background: '#fff', border: '1px solid #e6e1d3', borderRadius: 8, padding: 16, display: 'grid', gap: 5 },
  toast: { position: 'fixed', top: 16, right: 16, zIndex: 20, background: '#1b4332', color: '#fff', borderRadius: 8, padding: '12px 16px', fontSize: 13, fontWeight: 800, boxShadow: '0 18px 50px rgba(0,0,0,.18)' },
};
