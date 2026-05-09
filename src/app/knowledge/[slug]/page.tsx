import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticle, getProduct, knowledgeArticles } from '@/lib/marketData';
import { notFound } from 'next/navigation';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return knowledgeArticles.map(article => ({ slug: article.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const article = getArticle(params.slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
    },
  };
}

export default function KnowledgeArticlePage({ params }: Props) {
  const article = getArticle(params.slug);
  if (!article) notFound();
  const product = article.productSlug ? getProduct(article.productSlug) : undefined;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    publisher: { '@type': 'Organization', name: 'MuftahX' },
    about: product?.name || 'Kenyan export verification',
  };

  return (
    <main style={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <article style={styles.article}>
        <Link href="/knowledge" style={styles.back}>Knowledge hub</Link>
        <p style={styles.kicker}>Buyer-focused export guide</p>
        <h1 style={styles.h1}>{article.title}</h1>
        <p style={styles.lede}>{article.description}</p>
        {article.sections.map(section => (
          <section key={section.heading} style={styles.section}>
            <h2 style={styles.h2}>{section.heading}</h2>
            <p style={styles.text}>{section.body}</p>
          </section>
        ))}
        {product && (
          <Link href={`/products/${product.slug}`} style={styles.cta}>
            View verified {product.category} product page
          </Link>
        )}
      </article>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif', background: '#fafaf9', color: '#16160e', minHeight: '100vh' },
  article: { maxWidth: 820, margin: '0 auto', padding: '72px 24px 96px' },
  back: { color: '#1b4332', fontSize: 13, fontWeight: 700, textDecoration: 'none' },
  kicker: { marginTop: 32, color: '#c9952a', textTransform: 'uppercase', letterSpacing: '.14em', fontSize: 12, fontWeight: 700 },
  h1: { fontFamily: 'Georgia, serif', fontSize: 'clamp(38px, 6vw, 70px)', lineHeight: 1.04, margin: '12px 0 18px' },
  lede: { color: '#42423a', fontSize: 18, lineHeight: 1.8, marginBottom: 36 },
  section: { background: '#fff', border: '1px solid #e8e8e4', borderRadius: 8, padding: 24, marginBottom: 14 },
  h2: { fontFamily: 'Georgia, serif', fontSize: 28, margin: '0 0 10px' },
  text: { color: '#42423a', fontSize: 16, lineHeight: 1.8 },
  cta: { display: 'inline-flex', marginTop: 16, background: '#c9952a', color: '#1b4332', padding: '14px 20px', borderRadius: 6, textDecoration: 'none', fontWeight: 800 },
};
