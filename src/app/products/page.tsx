import type { Metadata } from 'next';
import Link from 'next/link';
import { products } from '@/lib/marketData';

export const metadata: Metadata = {
  title: 'Verified Kenyan Export Products',
  description: 'Browse verified Kenyan export categories including coffee, tea, flowers, avocado, macadamia, apparel, leather, spices, oils, and livestock.',
};

export default function ProductsPage() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <Link href="/index.html" style={styles.back}>MuftahX home</Link>
        <p style={styles.kicker}>Verified export categories</p>
        <h1 style={styles.h1}>Product pages built for buyer search.</h1>
        <p style={styles.lede}>
          Each category gives search engines and decision-makers a clear landing page:
          what Kenya exports, where it comes from, which documents matter, and what proof buyers should expect.
        </p>
      </section>
      <section style={styles.grid}>
        {products.map(product => (
          <Link key={product.slug} href={`/products/${product.slug}`} style={styles.card}>
            <img src={product.image} alt={product.name} style={styles.image} />
            <div style={styles.body}>
              <p style={styles.label}>{product.category}</p>
              <h2 style={styles.h2}>{product.name}</h2>
              <p style={styles.text}>{product.description}</p>
              <p style={styles.meta}>{product.certifications.slice(0, 3).join(' · ')}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif', background: '#fafaf9', color: '#16160e', minHeight: '100vh' },
  hero: { padding: '72px 24px 36px', maxWidth: 1120, margin: '0 auto' },
  back: { color: '#1b4332', fontSize: 13, fontWeight: 700, textDecoration: 'none' },
  kicker: { marginTop: 32, color: '#c9952a', textTransform: 'uppercase', letterSpacing: '.14em', fontSize: 12, fontWeight: 700 },
  h1: { fontFamily: 'Georgia, serif', fontSize: 'clamp(38px, 6vw, 72px)', lineHeight: 1.02, margin: '12px 0 18px', maxWidth: 780 },
  lede: { color: '#42423a', fontSize: 18, lineHeight: 1.8, maxWidth: 760 },
  grid: { maxWidth: 1120, margin: '0 auto', padding: '0 24px 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 },
  card: { background: '#fff', border: '1px solid #e8e8e4', borderRadius: 8, overflow: 'hidden', textDecoration: 'none', color: 'inherit', boxShadow: '0 8px 30px rgba(0,0,0,.06)' },
  image: { width: '100%', height: 180, objectFit: 'cover', display: 'block' },
  body: { padding: 20 },
  label: { color: '#c9952a', textTransform: 'uppercase', letterSpacing: '.12em', fontSize: 11, fontWeight: 700 },
  h2: { fontFamily: 'Georgia, serif', fontSize: 24, margin: '8px 0' },
  text: { color: '#42423a', fontSize: 14, lineHeight: 1.65 },
  meta: { color: '#1b4332', fontSize: 12, fontWeight: 700, marginTop: 14 },
};
