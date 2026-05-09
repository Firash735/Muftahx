'use client';
import { useState, useEffect, useCallback } from 'react';

type Reg = {
  id: string; type: string; email: string; company_name: string;
  contact_name: string; country: string; category: string;
  compliance: string; sourcing: string; status: string; created_at: string;
  document_ref?: string; document_status?: string; fraud_score?: number;
  fraud_flags?: string; rejection_reason?: string;
};
type Exp = {
  id: string; company_name: string; category: string; email: string;
  phone: string; website: string; is_verified: boolean; data_score: number; source: string;
};
type Stats = { total: number; sellers: number; buyers: number; review: number };

const G = '#1b4332', GOLD = '#c9952a', NAVY = '#0f2044';

export default function Admin() {
  const [page,    setPage]    = useState<'login'|'dash'>('login');
  const [tab,     setTab]     = useState<'regs'|'exporters'>('regs');
  const [stats,   setStats]   = useState<Stats|null>(null);
  const [regs,    setRegs]    = useState<Reg[]>([]);
  const [exps,    setExps]    = useState<Exp[]>([]);
  const [filter,  setFilter]  = useState('all');
  const [search,  setSearch]  = useState('');
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState('');
  const [email,   setEmail]   = useState('sharifabdi735@gmail.com');
  const [pass,    setPass]    = useState('');
  const [loginErr,setLErr]    = useState('');

  const toast_ = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3500); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const responses = await Promise.all([
        fetch('/api/admin?resource=stats'),
        fetch('/api/admin?resource=registrations'),
        fetch('/api/admin?resource=exporters'),
      ]);
      if (responses.some(x => x.status === 401)) {
        setPage('login');
        setLErr('Your admin session expired. Sign in again to continue.');
        setLoading(false);
        return;
      }
      const [s, r, e] = await Promise.all(responses.map(x => x.json()));
      if (s.total !== undefined) setStats(s);
      if (r.data) setRegs(r.data);
      if (e.data) setExps(e.data);
    } catch {}
    setLoading(false);
  }, []);

  const login = async () => {
    setLErr('');
    const r = await fetch('/api/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    });
    const d = await r.json();
    if (d.success) { setPage('dash'); load(); }
    else setLErr(d.error || 'Login failed');
  };

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setPage('login'); setStats(null); setRegs([]); setExps([]);
  };

  const updateStatus = async (id: string, status: string) => {
    const r = await fetch('/api/admin', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, table: 'registrations', updates: { status } }),
    });
    const d = await r.json();
    if (r.status === 401) {
      setPage('login');
      setLErr('Your admin session expired. Sign in again to continue.');
      return;
    }
    if (d.success) { setRegs(p => p.map(x => x.id === id ? { ...x, status } : x)); toast_('✓ Status updated to "' + status + '"'); }
  };

  const updateDocumentStatus = async (id: string, document_status: string) => {
    const updates: Partial<Reg> = { document_status };
    if (document_status === 'rejected' || document_status === 'reload_requested') updates.status = 'rejected';
    const r = await fetch('/api/admin', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, table: 'registrations', updates }),
    });
    const d = await r.json();
    if (r.status === 401) {
      setPage('login');
      setLErr('Your admin session expired. Sign in again to continue.');
      return;
    }
    if (d.success) {
      setRegs(p => p.map(x => x.id === id ? { ...x, ...updates } : x));
      toast_('✓ Document status updated to "' + document_status + '"');
    }
  };

  const filtRegs = regs.filter(r => {
    const m = filter === 'all' || r.type === filter || r.status === filter || r.document_status === filter;
    const s = !search || r.email?.toLowerCase().includes(search.toLowerCase()) || r.company_name?.toLowerCase().includes(search.toLowerCase());
    return m && s;
  });

  const filtExps = exps.filter(e =>
    !search || e.company_name?.toLowerCase().includes(search.toLowerCase()) || e.category?.toLowerCase().includes(search.toLowerCase())
  );

  // ── LOGIN SCREEN ─────────────────────────────────────────────────────────────
  if (page === 'login') return (
    <div style={{ minHeight:'100vh', background: NAVY, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace' }}>
      <div style={{ background:'#162040', border:`1px solid rgba(201,149,42,.3)`, borderRadius:16, padding:'2.5rem 2rem', width:380, boxShadow:'0 20px 60px rgba(0,0,0,.5)' }}>
        <div style={{ fontFamily:'Georgia,serif', fontSize:26, fontWeight:900, color:'#fff', marginBottom:2 }}>
          Muftah<span style={{ color: GOLD }}>X</span>
        </div>
        <div style={{ fontSize:10, color:'rgba(255,255,255,.35)', letterSpacing:'.12em', textTransform:'uppercase', marginBottom:6 }}>Admin Panel</div>
        <div style={{ height:2, width:36, background: GOLD, borderRadius:2, marginBottom:24 }} />

        {[
          { label:'Email',    val: email, set: setEmail, type:'email' },
          { label:'Password', val: pass,  set: setPass,  type:'password' },
        ].map(f => (
          <div key={f.label} style={{ marginBottom:14 }}>
            <div style={{ fontSize:9, color:'rgba(255,255,255,.4)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:5 }}>{f.label}</div>
            <input type={f.type} value={f.val}
              onChange={e => f.set(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              style={{ width:'100%', background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.15)', color:'#fff', fontFamily:'monospace', fontSize:13, padding:'10px 12px', borderRadius:7, outline:'none' }} />
          </div>
        ))}

        {loginErr && <div style={{ color:'#f87171', fontSize:11, marginBottom:10 }}>⚠ {loginErr}</div>}

        <button onClick={login}
          style={{ width:'100%', padding:13, background: GOLD, color: G, fontFamily:'monospace', fontSize:12, fontWeight:700, border:'none', borderRadius:7, cursor:'pointer', letterSpacing:'.04em', marginTop:4 }}>
          Sign In →
        </button>
        <div style={{ fontSize:10, color:'rgba(255,255,255,.25)', marginTop:14, textAlign:'center', lineHeight:1.6 }}>
          Admin access is protected. Use your MuftahX admin email and password.
        </div>
      </div>
    </div>
  );

  // ── DASHBOARD ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:'100vh', background:'#0a1020', color:'#fff', fontFamily:'monospace' }}>

      {/* toast */}
      {toast && (
        <div style={{ position:'fixed', top:16, right:16, zIndex:9999, background: G, border:'1px solid #40916c', color:'#fff', padding:'10px 20px', borderRadius:8, fontSize:12 }}>
          {toast}
        </div>
      )}

      {/* nav */}
      <nav style={{ background: NAVY, borderBottom:'1px solid rgba(201,149,42,.18)', height:60, padding:'0 2rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ fontFamily:'Georgia,serif', fontSize:20, fontWeight:700 }}>
            Muftah<span style={{ color: GOLD }}>X</span>
            <span style={{ fontSize:9, color:'rgba(255,255,255,.35)', marginLeft:10, letterSpacing:'.1em' }}>ADMIN</span>
          </div>
          <a href="/index.html" style={{ fontSize:11, color:'rgba(255,255,255,.45)', textDecoration:'none', border:'1px solid rgba(255,255,255,.1)', padding:'5px 12px', borderRadius:5 }}>
            ← Marketplace
          </a>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {(['regs','exporters'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setSearch(''); setFilter('all'); }}
              style={{ padding:'7px 16px', fontSize:11, border:'none', borderRadius:6, cursor:'pointer', letterSpacing:'.04em',
                background: tab===t ? 'rgba(201,149,42,.15)' : 'transparent',
                color: tab===t ? GOLD : 'rgba(255,255,255,.5)' }}>
              {t === 'regs' ? `Registrations${regs.length ? ' ('+regs.length+')' : ''}` : `Exporters${exps.length ? ' ('+exps.length+')' : ''}`}
            </button>
          ))}
          <button onClick={load} style={{ padding:'7px 14px', fontSize:11, border:'1px solid rgba(255,255,255,.12)', borderRadius:6, background:'transparent', color:'rgba(255,255,255,.5)', cursor:'pointer' }}>
            {loading ? '…' : '↻'}
          </button>
          <button onClick={logout} style={{ padding:'7px 14px', fontSize:11, border:'1px solid rgba(248,113,113,.3)', borderRadius:6, background:'transparent', color:'#f87171', cursor:'pointer' }}>
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'2rem' }}>

        {/* stats */}
        {stats && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
            {[
              { label:'Total Registrations', val: stats.total,     col:'#c9952a' },
              { label:'Sellers',             val: stats.sellers,   col:'#74c69d' },
              { label:'Buyers',              val: stats.buyers,    col:'#60a5fa' },
              { label:'Needs Document Reload', val: stats.review,   col:'#f87171' },
            ].map(s => (
              <div key={s.label} style={{ background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.08)', borderRadius:12, padding:'1.25rem' }}>
                <div style={{ fontSize:34, fontWeight:500, color: s.col, lineHeight:1 }}>{s.val}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.45)', marginTop:7 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {!stats && (
          <div style={{ background:'rgba(201,149,42,.08)', border:'1px solid rgba(201,149,42,.2)', borderRadius:12, padding:'1.5rem', marginBottom:24, fontSize:12, color:'rgba(255,255,255,.7)', lineHeight:1.8 }}>
            <strong style={{ color: GOLD }}>⚠ Supabase not connected yet.</strong><br/>
            Stats and data will appear here once you set up your <code>.env.local</code> and run the SQL schema.<br/>
            See the <strong>SETUP GUIDE</strong> file included in this project.
          </div>
        )}

        {/* search + filter */}
        <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={tab === 'regs' ? 'Search email or company…' : 'Search exporter or category…'}
            style={{ flex:1, minWidth:220, background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.13)', color:'#fff', padding:'9px 14px', borderRadius:8, fontSize:12, outline:'none', fontFamily:'monospace' }} />

          {tab === 'regs' && ['all','seller','buyer','new','contacted','converted','rejected','reload_requested'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding:'8px 14px', borderRadius:6, fontSize:11, cursor:'pointer',
                border: filter===f ? 'none' : '1px solid rgba(255,255,255,.13)',
                background: filter===f ? GOLD : 'rgba(255,255,255,.05)',
                color: filter===f ? G : 'rgba(255,255,255,.6)' }}>
              {f}
            </button>
          ))}
        </div>

        {/* ── REGISTRATIONS TABLE ── */}
        {tab === 'regs' && (
          <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:12, overflow:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:900 }}>
              <thead>
                <tr style={{ borderBottom:'1px solid rgba(255,255,255,.07)' }}>
                  {['Date','Type','Email','Company','Category / Country','Document / Fraud','Status','Change'].map(h => (
                    <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:9, color:'rgba(255,255,255,.35)', letterSpacing:'.1em', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtRegs.length === 0 && (
                  <tr><td colSpan={8} style={{ padding:'3rem', textAlign:'center', color:'rgba(255,255,255,.25)', fontSize:13 }}>
                    {regs.length === 0
                      ? '🌱 No registrations yet. Go to the marketplace and fill the registration form to see it here.'
                      : 'No results match your filter.'}
                  </td></tr>
                )}
                {filtRegs.map(r => (
                  <tr key={r.id}
                    style={{ borderBottom:'1px solid rgba(255,255,255,.04)', transition:'background .1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
                    <td style={TD}>{new Date(r.created_at).toLocaleDateString('en-KE', { day:'2-digit', month:'short', year:'2-digit' })}</td>
                    <td style={TD}>
                      <span style={{ padding:'2px 8px', borderRadius:4, fontSize:9, fontWeight:700,
                        background: r.type==='seller' ? 'rgba(116,198,157,.12)' : 'rgba(96,165,250,.12)',
                        color: r.type==='seller' ? '#74c69d' : '#60a5fa',
                        border: `1px solid ${r.type==='seller' ? 'rgba(116,198,157,.25)' : 'rgba(96,165,250,.25)'}` }}>
                        {(r.type||'').toUpperCase()}
                      </span>
                    </td>
                    <td style={TD}>{r.email}</td>
                    <td style={TD}>{r.company_name || '—'}</td>
                    <td style={TD}>{r.type==='seller' ? r.category : r.country || '—'}</td>
                    <td style={TD}>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,.55)', lineHeight:1.6 }}>
                        <div>{r.document_ref || r.compliance || r.sourcing || 'No document reference'}</div>
                        <div style={{ display:'flex', gap:6, alignItems:'center', flexWrap:'wrap', marginTop:4 }}>
                          <span style={{ padding:'2px 7px', borderRadius:4, fontSize:9, fontWeight:700,
                            background: SBG[r.document_status || 'pending'] || 'rgba(255,255,255,.08)',
                            color: SC[r.document_status || 'pending'] || 'rgba(255,255,255,.5)' }}>
                            {r.document_status || 'pending'}
                          </span>
                          <span style={{ color:(r.fraud_score || 0) >= 50 ? '#f87171' : (r.fraud_score || 0) >= 25 ? GOLD : '#74c69d', fontSize:10 }}>
                            risk {r.fraud_score || 0}/100
                          </span>
                        </div>
                        {(r.fraud_flags || r.rejection_reason) && (
                          <div style={{ color:'#fca5a5', fontSize:10, marginTop:3 }}>{r.fraud_flags || r.rejection_reason}</div>
                        )}
                        <select value={r.document_status || 'pending'} onChange={e => updateDocumentStatus(r.id, e.target.value)}
                          style={{ marginTop:6, background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.12)', color:'#fff', padding:'5px 9px', borderRadius:5, fontSize:10, cursor:'pointer', fontFamily:'monospace' }}>
                          {['pending','verified','reload_requested','rejected'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </td>
                    <td style={TD}>
                      <span style={{ padding:'2px 9px', borderRadius:4, fontSize:9, fontWeight:700,
                        background: SBG[r.status]||'rgba(255,255,255,.08)', color: SC[r.status]||'rgba(255,255,255,.5)' }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={TD}>
                      <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)}
                        style={{ background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.12)', color:'#fff', padding:'5px 9px', borderRadius:5, fontSize:10, cursor:'pointer', fontFamily:'monospace' }}>
                        {['new','contacted','converted','rejected'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── EXPORTERS TABLE ── */}
        {tab === 'exporters' && (
          <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:12, overflow:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:900 }}>
              <thead>
                <tr style={{ borderBottom:'1px solid rgba(255,255,255,.07)' }}>
                  {['Company','Category','Email','Phone','Website','Score','Verified','Source'].map(h => (
                    <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:9, color:'rgba(255,255,255,.35)', letterSpacing:'.1em', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtExps.length === 0 && (
                  <tr><td colSpan={8} style={{ padding:'3rem', textAlign:'center', color:'rgba(255,255,255,.25)', fontSize:13 }}>
                    🗄 No exporters yet. Run the data engine pipeline to populate this table.
                  </td></tr>
                )}
                {filtExps.map(e => (
                  <tr key={e.id}
                    style={{ borderBottom:'1px solid rgba(255,255,255,.04)', transition:'background .1s' }}
                    onMouseEnter={ev => (ev.currentTarget.style.background='rgba(255,255,255,.04)')}
                    onMouseLeave={ev => (ev.currentTarget.style.background='transparent')}>
                    <td style={{ ...TD, fontWeight:600 }}>{e.company_name}</td>
                    <td style={TD}>{e.category || '—'}</td>
                    <td style={{ ...TD, fontSize:11, color:'rgba(255,255,255,.6)' }}>{e.email || '—'}</td>
                    <td style={{ ...TD, fontSize:11, color:'rgba(255,255,255,.6)' }}>{e.phone || '—'}</td>
                    <td style={TD}>{e.website ? <a href={e.website} target="_blank" rel="noopener" style={{ color: GOLD, fontSize:11 }}>↗ link</a> : '—'}</td>
                    <td style={TD}>
                      <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                        <div style={{ height:5, borderRadius:3, width:50, background:'rgba(255,255,255,.1)' }}>
                          <div style={{ height:5, borderRadius:3, background: (e.data_score||0)>=7 ? '#74c69d' : (e.data_score||0)>=4 ? GOLD : '#f87171', width:`${(e.data_score||0)*10}%` }} />
                        </div>
                        <span style={{ fontSize:10, color:'rgba(255,255,255,.4)' }}>{e.data_score}/10</span>
                      </div>
                    </td>
                    <td style={TD}><span style={{ color: e.is_verified ? '#74c69d' : 'rgba(255,255,255,.25)', fontSize:13 }}>{e.is_verified ? '✓' : '–'}</span></td>
                    <td style={{ ...TD, fontSize:10, color:'rgba(255,255,255,.35)' }}>{e.source || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const TD: React.CSSProperties = { padding:'11px 14px', fontSize:12, color:'rgba(255,255,255,.8)', verticalAlign:'middle' };
const SBG: Record<string,string> = { new:'rgba(201,149,42,.14)', contacted:'rgba(96,165,250,.14)', converted:'rgba(116,198,157,.14)', rejected:'rgba(248,113,113,.14)', pending:'rgba(201,149,42,.14)', verified:'rgba(116,198,157,.14)', reload_requested:'rgba(248,113,113,.14)' };
const SC:  Record<string,string> = { new:'#c9952a', contacted:'#60a5fa', converted:'#74c69d', rejected:'#f87171', pending:'#c9952a', verified:'#74c69d', reload_requested:'#f87171' };
