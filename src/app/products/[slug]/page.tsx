import type { Metadata } from 'next';
import Link from 'next/link';
import { getProduct, products } from '@/lib/marketData';
import { notFound } from 'next/navigation';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return products.map(product => ({ slug: product.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const product = getProduct(params.slug);
  if (!product) return {};
  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.image],
    },
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    category: product.category,
    description: product.description,
    image: product.image,
    brand: { '@type': 'Brand', name: 'MuftahX' },
    areaServed: product.markets,
  };

  return (
    <main style={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section style={{ ...styles.hero, backgroundImage: `linear-gradient(90deg, rgba(7,19,13,.94), rgba(7,19,13,.58)), url(${product.image})` }}>
        <div style={styles.heroInner}>
          <Link href="/products" style={styles.back}>All products</Link>
          <p style={styles.kicker}>{product.category}</p>
          <h1 style={styles.h1}>{product.name}</h1>
          <p style={styles.lede}>{product.description}</p>
        </div>
      </section>
      <section style={styles.content}>
        <div style={styles.mainCol}>
          <h2 style={styles.h2}>Buyer intent this page answers</h2>
          <p style={styles.text}>{product.buyerIntent}</p>

          <h2 style={styles.h2}>Verification proof buyers should see</h2>
          <div style={styles.chipGrid}>
            {product.proof.map(item => <span key={item} style={styles.chip}>{item}</span>)}
          </div>

          <h2 style={styles.h2}>Documents and standards</h2>
          <ul style={styles.list}>
            {product.certifications.map(cert => <li key={cert}>{cert}</li>)}
          </ul>
        </div>
        <aside style={styles.aside}>
          <div style={styles.panel}>
            <h3 style={styles.h3}>Origin regions</h3>
            <p style={styles.small}>{product.regions.join(' · ')}</p>
          </div>
          <div style={styles.panel}>
            <h3 style={styles.h3}>Buyer markets</h3>
            <p style={styles.small}>{product.markets.join(' · ')}</p>
          </div>
          <div style={styles.cta}>
            <h3 style={styles.h3}>Next platform step</h3>
            <p style={styles.small}>Turn this category into live supplier listings with verified documents, seller score, available volume, and direct buyer inquiry.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif', background: '#fafaf9', color: '#16160e', minHeight: '100vh' },
  hero: { minHeight: 460, backgroundSize: 'cover', backgroundPosition: 'center', color: '#fff', display: 'flex', alignItems: 'end' },
  heroInner: { maxWidth: 1120, width: '100%', margin: '0 auto', padding: '72px 24px' },
  back: { color: '#e5b84a', fontSize: 13, fontWeight: 700, textDecoration: 'none' },
  kicker: { marginTop: 34, color: '#e5b84a', textTransform: 'uppercase', letterSpacing: '.14em', fontSize: 12, fontWeight: 700 },
  h1: { fontFamily: 'Georgia, serif', fontSize: 'clamp(44px, 7vw, 86px)', lineHeight: 1, margin: '12px 0 18px', maxWidth: 860 },
  lede: { color: 'rgba(255,255,255,.76)', fontSize: 18, lineHeight: 1.8, maxWidth: 760 },
  content: { maxWidth: 1120, margin: '0 auto', padding: '56px 24px 88px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 },
  mainCol: { background: '#fff', border: '1px solid #e8e8e4', borderRadius: 8, padding: 28 },
  h2: { fontFamily: 'Georgia, serif', fontSize: 30, margin: '0 0 12px' },
  text: { color: '#42423a', fontSize: 16, lineHeight: 1.8, marginBottom: 32 },
  chipGrid: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 },
  chip: { border: '1px solid #d1f0e0', background: '#f0faf5', color: '#1b4332', borderRadius: 4, padding: '8px 10px', fontSize: 13, fontWeight: 700 },
  list: { color: '#42423a', lineHeight: 1.9, paddingLeft: 22, margin: 0 },
  aside: { display: 'grid', gap: 14, alignContent: 'start' },
  panel: { background: '#fff', border: '1px solid #e8e8e4', borderRadius: 8, padding: 22 },
  cta: { background: '#1b4332', borderRadius: 8, padding: 22, color: '#fff' },
  h3: { fontFamily: 'Georgia, serif', fontSize: 22, margin: '0 0 10px' },
  small: { color: 'inherit', opacity: .78, lineHeight: 1.7, fontSize: 14 },
};
