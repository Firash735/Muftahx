'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';

type Role = 'seller' | 'buyer';
type Message = { from: 'ai' | 'user'; text: string; gated?: boolean };

const quickPrompts = [
  'I am a Kenyan avocado exporter. What documents do I need?',
  'I am a UAE buyer. How do I know a supplier is verified?',
  'My certificate was rejected. What should I reload?',
  'How does MuftahX protect both buyers and sellers?',
];

const lockedFeatures = [
  'Supplier shortlists and buyer introductions',
  'Full document interpretation and rejection reasons',
  'Market-specific export playbooks',
  'Negotiation, pricing, and deal support',
];

function answerQuestion(question: string): Message[] {
  const q = question.toLowerCase();
  let publicAnswer = 'MuftahX can help with signup, seller verification, buyer sourcing, documents, product pages, and admin review. Ask with your role, product, and destination market for the best answer.';
  let lockedAnswer = 'For the full answer, sign up with Google so MuftahX can save your role, company context, product interest, and verification status.';

  if (q.includes('google') || q.includes('signup') || q.includes('sign up')) {
    publicAnswer = 'Use Google signup as the main entry point. Sellers should use a business Gmail or company email. Buyers can join free, then search verified categories and send serious inquiries.';
    lockedAnswer = 'After Google signup, MuftahX should attach your role, email, and intent to a profile so admin can separate real buyers, real sellers, and low-quality registrations.';
  } else if (q.includes('document') || q.includes('certificate') || q.includes('kephis') || q.includes('rejected')) {
    publicAnswer = 'For sellers, MuftahX checks whether your company, product category, and certificate reference look real. Missing certificate details or unclear upload links can trigger reload request or rejection.';
    lockedAnswer = 'Signed-in sellers should get exact reload instructions: which document is missing, what certificate number or upload link to provide, and why admin rejected the first submission.';
  } else if (q.includes('buyer') || q.includes('supplier') || q.includes('verified')) {
    publicAnswer = 'Buyers should look for verified sellers with clear product photos, certificate status, export category, destination-market fit, and admin-approved document status.';
    lockedAnswer = 'Signed-in buyers should receive curated supplier matches, document confidence level, response-speed signals, and recommended questions before contacting a seller.';
  } else if (q.includes('profit') || q.includes('money') || q.includes('commission') || q.includes('price')) {
    publicAnswer = 'The strongest model is free buyer access, free seller trial, then paid seller visibility, document review, featured listings, and enterprise intelligence. Avoid taking commission on the first deal while trust is growing.';
    lockedAnswer = 'Signed-in sellers can get deal support: benchmark price, minimum acceptable offer, negotiation checklist, and when to reject low-quality buyer offers.';
  } else if (q.includes('admin') || q.includes('approve') || q.includes('fraud')) {
    publicAnswer = 'Admin reviews registrations, document status, fraud flags, exporter data, and whether sellers are ready to be visible to buyers.';
    lockedAnswer = 'Admin-only support should show the exact risk reasons, recommended action, and seller notification copy for approval, rejection, or document reload.';
  }

  return [
    { from: 'ai', text: publicAnswer },
    { from: 'ai', text: lockedAnswer, gated: true },
  ];
}

export default function SupportClient() {
  const [role, setRole] = useState<Role>('seller');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      from: 'ai',
      text: 'Ask me about Google signup, verified sellers, buyer sourcing, KEPHIS documents, rejected certificates, pricing, or how admin approval works.',
    },
  ]);

  const signupUrl = useMemo(() => `/api/auth/google?type=${role}`, [role]);

  const ask = (value?: string) => {
    const text = (value || question).trim();
    if (!text) return;
    const lower = text.toLowerCase();
    if (lower.includes('buyer') || lower.includes('supplier')) setRole('buyer');
    if (lower.includes('seller') || lower.includes('exporter')) setRole('seller');
    setMessages(prev => [...prev, { from: 'user', text }, ...answerQuestion(text)]);
    setQuestion('');
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    ask();
  };

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.nav}>
          <Link href="/index.html" style={styles.navLink}>MuftahX home</Link>
          <Link href="/products" style={styles.navLink}>Products</Link>
          <Link href="/knowledge" style={styles.navLink}>Knowledge</Link>
          <Link href="/admin" style={styles.navLink}>Admin</Link>
        </div>
        <p style={styles.kicker}>AI support desk</p>
        <h1 style={styles.h1}>Ask questions. Get direction. Sign up for the full support layer.</h1>
        <p style={styles.lede}>
          MuftahX support gives public guidance first, then unlocks deeper help after Google signup.
          This keeps the platform useful for visitors while protecting supplier data, document review,
          buyer matching, and negotiation support for registered users.
        </p>
      </section>

      <section style={styles.shell}>
        <aside style={styles.side}>
          <p style={styles.sideLabel}>Choose your path</p>
          <div style={styles.toggle}>
            <button onClick={() => setRole('seller')} style={role === 'seller' ? styles.toggleActive : styles.toggleBtn}>Seller</button>
            <button onClick={() => setRole('buyer')} style={role === 'buyer' ? styles.toggleActive : styles.toggleBtn}>Buyer</button>
          </div>
          <a href={signupUrl} style={styles.signup}>Continue with Google</a>
          <p style={styles.helpText}>
            Registered users get saved context, stronger support, and access to the next step. Public visitors only see general guidance.
          </p>
          <div style={styles.lockBox}>
            <p style={styles.sideLabel}>Locked after signup</p>
            {lockedFeatures.map(feature => <div key={feature} style={styles.lockItem}>{feature}</div>)}
          </div>
        </aside>

        <section style={styles.assistant}>
          <div style={styles.assistantTop}>
            <div>
              <p style={styles.mini}>MuftahX assistant</p>
              <h2 style={styles.h2}>Ask by role, product, country, or document.</h2>
            </div>
            <span style={styles.status}>Public mode</span>
          </div>

          <div style={styles.messages}>
            {messages.map((message, index) => (
              <div key={`${message.from}-${index}`} style={message.from === 'user' ? styles.userMsg : styles.aiMsg}>
                {message.gated && <div style={styles.gated}>Signup required</div>}
                <p style={styles.msgText}>{message.text}</p>
                {message.gated && (
                  <a href={signupUrl} style={styles.inlineSignup}>Unlock with Google</a>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={onSubmit} style={styles.inputRow}>
            <input
              value={question}
              onChange={event => setQuestion(event.target.value)}
              style={styles.input}
              aria-label="Support question"
              placeholder="Ask about signup, verification, documents, buyers..."
            />
            <button type="submit" style={styles.button}>Ask</button>
          </form>

          <div style={styles.promptGrid}>
            {quickPrompts.map(prompt => (
              <button key={prompt} type="button" onClick={() => ask(prompt)} style={styles.prompt}>{prompt}</button>
            ))}
          </div>
        </section>
      </section>

      <section style={styles.workflow}>
        <p style={styles.kicker}>How it should work</p>
        <h2 style={styles.h2Dark}>Support becomes a conversion system.</h2>
        <div style={styles.steps}>
          {[
            ['1', 'Visitor asks a question and receives useful public guidance.'],
            ['2', 'Sensitive details stay locked: supplier lists, exact document review, pricing, and deal advice.'],
            ['3', 'Visitor signs up with Google as seller or buyer to unlock deeper help.'],
            ['4', 'Admin sees registrations and reviews quality before serious marketplace access.'],
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
  hero: { maxWidth: 1120, margin: '0 auto', padding: '48px 24px 26px' },
  nav: { display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 48 },
  navLink: { color: '#1b4332', textDecoration: 'none', fontSize: 13, fontWeight: 800 },
  kicker: { color: '#b8841f', textTransform: 'uppercase', letterSpacing: '.14em', fontSize: 12, fontWeight: 800, margin: 0 },
  h1: { fontFamily: 'Georgia, serif', fontSize: 'clamp(40px, 6vw, 74px)', lineHeight: 1.02, margin: '14px 0 18px', maxWidth: 890 },
  lede: { color: '#44443c', fontSize: 18, lineHeight: 1.75, maxWidth: 820 },
  shell: { maxWidth: 1120, margin: '0 auto', padding: '0 24px 56px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 16 },
  side: { background: '#fff', border: '1px solid #e6e1d3', borderRadius: 8, padding: 20, alignSelf: 'start' },
  sideLabel: { color: '#8b6b26', textTransform: 'uppercase', letterSpacing: '.12em', fontSize: 11, fontWeight: 900, margin: '0 0 12px' },
  toggle: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 },
  toggleBtn: { border: '1px solid #e0dacb', background: '#fbfaf6', color: '#284137', borderRadius: 6, padding: '11px 12px', fontWeight: 900, cursor: 'pointer' },
  toggleActive: { border: '1px solid #1b4332', background: '#1b4332', color: '#fff', borderRadius: 6, padding: '11px 12px', fontWeight: 900, cursor: 'pointer' },
  signup: { display: 'block', textAlign: 'center', background: '#c9952a', color: '#163125', textDecoration: 'none', borderRadius: 6, padding: '13px 14px', fontWeight: 900, marginBottom: 12 },
  helpText: { color: '#56564d', lineHeight: 1.65, fontSize: 13, margin: '0 0 18px' },
  lockBox: { borderTop: '1px solid #ece7d8', paddingTop: 16 },
  lockItem: { color: '#1b4332', fontWeight: 800, fontSize: 13, lineHeight: 1.45, padding: '9px 0', borderBottom: '1px solid #f0ecdf' },
  assistant: { background: '#111b18', color: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 24px 70px rgba(0,0,0,.18)' },
  assistantTop: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 22 },
  mini: { color: '#c9952a', textTransform: 'uppercase', letterSpacing: '.12em', fontSize: 11, fontWeight: 800, margin: '0 0 8px' },
  h2: { fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.08, margin: 0 },
  h2Dark: { fontFamily: 'Georgia, serif', fontSize: 'clamp(30px, 4vw, 48px)', lineHeight: 1.08, margin: '10px 0 0' },
  status: { color: '#f2cf77', border: '1px solid rgba(242,207,119,.35)', borderRadius: 999, padding: '7px 12px', fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap' },
  messages: { display: 'grid', gap: 12, maxHeight: 440, overflow: 'auto', paddingRight: 4 },
  aiMsg: { background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 8, padding: 16 },
  userMsg: { background: 'rgba(201,149,42,.16)', border: '1px solid rgba(201,149,42,.28)', borderRadius: 8, padding: 16, marginLeft: 28 },
  gated: { display: 'inline-block', color: '#f2cf77', border: '1px solid rgba(242,207,119,.35)', borderRadius: 999, padding: '4px 8px', fontSize: 11, fontWeight: 900, marginBottom: 8 },
  msgText: { margin: 0, color: 'rgba(255,255,255,.84)', lineHeight: 1.68, fontSize: 14 },
  inlineSignup: { display: 'inline-block', marginTop: 12, color: '#f2cf77', fontWeight: 900, textDecoration: 'none', fontSize: 13 },
  inputRow: { display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, marginTop: 16 },
  input: { minWidth: 0, border: '1px solid rgba(255,255,255,.16)', background: 'rgba(255,255,255,.08)', color: '#fff', borderRadius: 6, padding: '13px 14px', fontSize: 14 },
  button: { border: 0, background: '#c9952a', color: '#173225', borderRadius: 6, padding: '0 20px', fontWeight: 900, cursor: 'pointer' },
  promptGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 10, marginTop: 18 },
  prompt: { textAlign: 'left', background: 'transparent', border: '1px solid rgba(255,255,255,.12)', borderRadius: 6, padding: 12, color: 'rgba(255,255,255,.68)', fontSize: 13, lineHeight: 1.55, cursor: 'pointer' },
  workflow: { maxWidth: 1120, margin: '0 auto', padding: '0 24px 80px' },
  steps: { display: 'grid', gap: 10, marginTop: 22 },
  step: { display: 'grid', gridTemplateColumns: '42px 1fr', gap: 14, alignItems: 'center', background: '#fff', border: '1px solid #e6e1d3', borderRadius: 8, padding: 16 },
  stepNo: { width: 42, height: 42, borderRadius: 999, background: '#1b4332', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 },
  stepText: { color: '#34342e', margin: 0, lineHeight: 1.65 },
};
