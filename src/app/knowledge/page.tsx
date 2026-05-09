import type { Metadata } from 'next';
import Link from 'next/link';
import { knowledgeArticles } from '@/lib/marketData';

export const metadata: Metadata = {
  title: 'Kenya Export Knowledge Hub',
  description: 'Buyer-focused guides for Kenyan export documents, product sourcing, AI-first discovery, and verified supplier selection.',
};

export default function KnowledgePage() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <Link href="/index.html" style={styles.back}>MuftahX home</Link>
        <p style={styles.kicker}>Knowledge hub</p>
        <h1 style={styles.h1}>Information that brings qualified buyers in.</h1>
        <p style={styles.lede}>
          These articles target the questions decision-makers and AI engines ask before choosing a supplier.
          They create traffic with useful export answers, then direct that traffic into verified product pages.
        </p>
      </section>
      <section style={styles.grid}>
        {knowledgeArticles.map(article => (
          <Link key={article.slug} href={`/knowledge/${article.slug}`} style={styles.card}>
            <p style={styles.label}>Export guide</p>
            <h2 style={styles.h2}>{article.title}</h2>
            <p style={styles.text}>{article.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif', background: '#07130d', color: '#fff', minHeight: '100vh' },
  hero: { padding: '72px 24px 36px', maxWidth: 1120, margin: '0 auto' },
  back: { color: '#e5b84a', fontSize: 13, fontWeight: 700, textDecoration: 'none' },
  kicker: { marginTop: 32, color: '#c9952a', textTransform: 'uppercase', letterSpacing: '.14em', fontSize: 12, fontWeight: 700 },
  h1: { fontFamily: 'Georgia, serif', fontSize: 'clamp(38px, 6vw, 72px)', lineHeight: 1.02, margin: '12px 0 18px', maxWidth: 820 },
  lede: { color: 'rgba(255,255,255,.7)', fontSize: 18, lineHeight: 1.8, maxWidth: 780 },
  grid: { maxWidth: 1120, margin: '0 auto', padding: '0 24px 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 },
  card: { background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 8, padding: 24, textDecoration: 'none', color: 'inherit' },
  label: { color: '#c9952a', textTransform: 'uppercase', letterSpacing: '.12em', fontSize: 11, fontWeight: 700 },
  h2: { fontFamily: 'Georgia, serif', fontSize: 27, lineHeight: 1.15, margin: '10px 0' },
  text: { color: 'rgba(255,255,255,.68)', fontSize: 14, lineHeight: 1.7 },
};
