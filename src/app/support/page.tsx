import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'MuftahX AI Support',
  description: 'Get guided support for MuftahX buyers, sellers, verification, Google signup, admin review, and export marketplace workflows.',
};

const supportTracks = [
  {
    title: 'For sellers',
    text: 'Prepare your company profile, product category, certificate reference, product photos, and export readiness details before verification.',
    items: ['Google signup with a business email', 'Document reference review', 'Fraud-risk score', 'Admin approval before visibility'],
  },
  {
    title: 'For buyers',
    text: 'Search by commodity, destination market, certification, and proof. Buyers should only trust suppliers with visible documents and product details.',
    items: ['Free buyer access', 'Verified supplier discovery', 'Product and certificate checks', 'Direct inquiry after review'],
  },
  {
    title: 'For admins',
    text: 'Use the admin panel to review registrations, document status, fraud flags, exporter data, and seller readiness before approval.',
    items: ['Approve or reject registrations', 'Request document reload', 'Track seller and buyer counts', 'Protect marketplace quality'],
  },
];

const prompts = [
  'I am a Kenyan avocado exporter. What documents do I need before listing?',
  'I am a UAE buyer. How do I know a supplier is verified?',
  'My certificate was rejected. What should I reload?',
  'How does MuftahX make money without taking commission from my first deal?',
];

export default function SupportPage() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.nav}>
          <Link href="/index.html" style={styles.navLink}>MuftahX home</Link>
          <Link href="/admin" style={styles.navLink}>Admin</Link>
          <Link href="/knowledge" style={styles.navLink}>Knowledge</Link>
        </div>
        <p style={styles.kicker}>AI support desk</p>
        <h1 style={styles.h1}>Support that explains the platform before a customer gets lost.</h1>
        <p style={styles.lede}>
          This page gives buyers, sellers, and admins a clear path through signup, verification,
          documents, product visibility, and marketplace trust. It is designed as the front door
          for a future AI assistant.
        </p>
        <div style={styles.actions}>
          <a href="/api/auth/google?type=seller" style={styles.primary}>Seller Google signup</a>
          <a href="/api/auth/google?type=buyer" style={styles.secondary}>Buyer Google signup</a>
        </div>
      </section>

      <section style={styles.panelWrap}>
        <div style={styles.assistant}>
          <div style={styles.assistantTop}>
            <div>
              <p style={styles.mini}>MuftahX assistant prototype</p>
              <h2 style={styles.h2}>Ask by role, product, country, or document.</h2>
            </div>
            <span style={styles.status}>Ready</span>
          </div>
          <div style={styles.chat}>
            <div style={styles.bot}>
              Tell me if you are a seller, buyer, or admin. Then include the product, destination market,
              and document question. Example: "Seller, avocado to UAE, KEPHIS certificate."
            </div>
            <div style={styles.inputRow}>
              <input
                style={styles.input}
                aria-label="Support question"
                placeholder="Ask about signup, verification, documents, or buyers..."
                readOnly
              />
              <button style={styles.button}>Prototype</button>
            </div>
          </div>
          <div style={styles.promptGrid}>
            {prompts.map(prompt => (
              <div key={prompt} style={styles.prompt}>{prompt}</div>
            ))}
          </div>
        </div>
      </section>

      <section style={styles.grid}>
        {supportTracks.map(track => (
          <article key={track.title} style={styles.card}>
            <h2 style={styles.cardTitle}>{track.title}</h2>
            <p style={styles.text}>{track.text}</p>
            <ul style={styles.list}>
              {track.items.map(item => <li key={item}>{item}</li>)}
            </ul>
          </article>
        ))}
      </section>

      <section style={styles.workflow}>
        <p style={styles.kicker}>How admin works</p>
        <h2 style={styles.h2}>The admin panel is the trust control room.</h2>
        <div style={styles.steps}>
          {[
            ['1', 'A seller or buyer signs up with Google or the manual form.'],
            ['2', 'Seller submissions are scored for document quality, email quality, company detail, and risk flags.'],
            ['3', 'Admin reviews status, document status, fraud flags, and exporter records.'],
            ['4', 'Approved sellers become ready for visibility. Rejected sellers are asked to reload better documents.'],
          ].map(([n, text]) => (
            <div key={n} style={styles.step}>
              <span style={styles.stepNo}>{n}</span>
              <p style={styles.stepText}>{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f8f7f2', color: '#171711', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif' },
  hero: { maxWidth: 1120, margin: '0 auto', padding: '48px 24px 30px' },
  nav: { display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 50 },
  navLink: { color: '#1b4332', textDecoration: 'none', fontSize: 13, fontWeight: 800 },
  kicker: { color: '#b8841f', textTransform: 'uppercase', letterSpacing: '.14em', fontSize: 12, fontWeight: 800, margin: 0 },
  h1: { fontFamily: 'Georgia, serif', fontSize: 'clamp(40px, 6vw, 74px)', lineHeight: 1.02, margin: '14px 0 18px', maxWidth: 850 },
  lede: { color: '#44443c', fontSize: 18, lineHeight: 1.75, maxWidth: 780 },
  actions: { display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 },
  primary: { background: '#1b4332', color: '#fff', textDecoration: 'none', borderRadius: 6, padding: '13px 18px', fontWeight: 800, fontSize: 14 },
  secondary: { background: '#fff', color: '#1b4332', textDecoration: 'none', border: '1px solid #d9d5c7', borderRadius: 6, padding: '13px 18px', fontWeight: 800, fontSize: 14 },
  panelWrap: { maxWidth: 1120, margin: '0 auto', padding: '0 24px' },
  assistant: { background: '#111b18', color: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 24px 70px rgba(0,0,0,.18)' },
  assistantTop: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 24 },
  mini: { color: '#c9952a', textTransform: 'uppercase', letterSpacing: '.12em', fontSize: 11, fontWeight: 800, margin: '0 0 8px' },
  h2: { fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.08, margin: 0 },
  status: { color: '#74c69d', border: '1px solid rgba(116,198,157,.3)', borderRadius: 999, padding: '7px 12px', fontSize: 12, fontWeight: 800 },
  chat: { display: 'grid', gap: 16 },
  bot: { background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 8, padding: 18, color: 'rgba(255,255,255,.82)', lineHeight: 1.7 },
  inputRow: { display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 },
  input: { minWidth: 0, border: '1px solid rgba(255,255,255,.16)', background: 'rgba(255,255,255,.08)', color: '#fff', borderRadius: 6, padding: '13px 14px', fontSize: 14 },
  button: { border: 0, background: '#c9952a', color: '#173225', borderRadius: 6, padding: '0 18px', fontWeight: 900 },
  promptGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginTop: 18 },
  prompt: { border: '1px solid rgba(255,255,255,.12)', borderRadius: 6, padding: 12, color: 'rgba(255,255,255,.68)', fontSize: 13, lineHeight: 1.55 },
  grid: { maxWidth: 1120, margin: '0 auto', padding: '24px 24px 56px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 14 },
  card: { background: '#fff', border: '1px solid #e6e1d3', borderRadius: 8, padding: 22 },
  cardTitle: { fontFamily: 'Georgia, serif', fontSize: 27, margin: '0 0 10px' },
  text: { color: '#46463f', lineHeight: 1.7, fontSize: 14 },
  list: { color: '#1b4332', lineHeight: 1.9, paddingLeft: 18, fontSize: 14, fontWeight: 700 },
  workflow: { maxWidth: 1120, margin: '0 auto', padding: '0 24px 80px' },
  steps: { display: 'grid', gap: 10, marginTop: 22 },
  step: { display: 'grid', gridTemplateColumns: '42px 1fr', gap: 14, alignItems: 'center', background: '#fff', border: '1px solid #e6e1d3', borderRadius: 8, padding: 16 },
  stepNo: { width: 42, height: 42, borderRadius: 999, background: '#1b4332', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 },
  stepText: { color: '#34342e', margin: 0, lineHeight: 1.65 },
};
