-- ================================================================
-- MuftahX — Supabase Database Schema
-- HOW TO USE:
--   1. Go to supabase.com → your project → SQL Editor
--   2. Paste this entire file → click Run
--   3. Done. All tables will be created.
-- ================================================================

create extension if not exists "pgcrypto";

-- ── USERS (admin accounts) ────────────────────────────────────
create table if not exists users (
  id            uuid        primary key default gen_random_uuid(),
  email         text        not null unique,
  password_hash text        not null,
  role          text        not null default 'admin' check (role in ('seller','buyer','admin')),
  status        text        not null default 'active' check (status in ('pending','active','rejected')),
  created_at    timestamptz default now()
);

-- ── REGISTRATIONS (from the marketplace modal) ────────────────
create table if not exists registrations (
  id            uuid        primary key default gen_random_uuid(),
  type          text        not null check (type in ('seller','buyer')),
  email         text        not null,
  company_name  text,
  contact_name  text,
  country       text,
  category      text,
  compliance    text,
  sourcing      text,
  document_ref  text,
  document_status text    default 'pending' check (document_status in ('pending','verified','rejected','reload_requested')),
  fraud_score   integer   default 0,
  fraud_flags   text,
  rejection_reason text,
  status        text        default 'new' check (status in ('new','contacted','converted','rejected')),
  notes         text,
  created_at    timestamptz default now()
);

-- Upgrade existing projects created from an older version of this schema.
alter table registrations add column if not exists document_ref text;
alter table registrations add column if not exists document_status text default 'pending' check (document_status in ('pending','verified','rejected','reload_requested'));
alter table registrations add column if not exists fraud_score integer default 0;
alter table registrations add column if not exists fraud_flags text;
alter table registrations add column if not exists rejection_reason text;

-- ── EXPORTERS (populated by data engine) ─────────────────────
create table if not exists exporters (
  id               uuid        primary key default gen_random_uuid(),
  company_name     text        not null unique,
  category         text,
  email            text,
  email_status     text,
  phone            text,
  website          text,
  address          text,
  reg_number       text,
  contact_person   text,
  google_place_id  text,
  rating           numeric(2,1),
  source           text,
  is_verified      boolean     default false,
  data_score       integer     default 0,
  claimed          boolean     default false,
  user_id          uuid,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- ── ROW LEVEL SECURITY ────────────────────────────────────────
alter table registrations enable row level security;
alter table exporters     enable row level security;
alter table users         enable row level security;

-- Anyone can INSERT a registration (this is the modal form)
create policy "public_insert_registrations"
  on registrations for insert with check (true);

-- Anyone can READ exporters (public marketplace search)
create policy "public_read_exporters"
  on exporters for select using (true);

-- ── INDEXES ───────────────────────────────────────────────────
create index if not exists idx_reg_type    on registrations(type);
create index if not exists idx_reg_status  on registrations(status);
create index if not exists idx_reg_email   on registrations(email);
create index if not exists idx_reg_doc_status on registrations(document_status);
create index if not exists idx_exp_cat     on exporters(category);
create index if not exists idx_exp_score   on exporters(data_score desc);

-- ── SAMPLE EXPORTERS (for testing the admin panel) ────────────
insert into exporters (company_name, category, email, phone, is_verified, data_score, source)
values
  ('Naivasha Rose Growers Ltd',   'Flowers',      'exports@nrg.co.ke',    '+254 712 000 001', true,  9, 'KEPHIS'),
  ('Kenya AA Coffee Estates',     'Coffee',        'trade@kaace.co.ke',    '+254 712 000 002', true,  8, 'KEPHIS'),
  ('Fresh Horticulture Kenya',    'Horticulture', 'sales@fhk.co.ke',      '+254 712 000 003', false, 5, 'AFA/HCD'),
  ('Rift Valley Tea Producers',   'Tea',           'exports@rvtp.co.ke',   '+254 712 000 004', true,  8, 'KTDA'),
  ('Macadamia Africa Ltd',        'Macadamia',     'info@macafrica.co.ke', '+254 712 000 005', false, 4, 'Google Places'),
  ('Mombasa Spice Exporters',     'Spices',        null,                   '+254 712 000 006', false, 3, 'AFA/HCD'),
  ('Great Rift Leather Goods',    'Leather',       'sales@grlg.co.ke',     '+254 712 000 007', true,  7, 'KEPHIS')
on conflict (company_name) do nothing;

-- ── ADMIN USER ────────────────────────────────────────────────
-- Password: admin123
-- bcrypt hash of "admin123" with cost 10
insert into users (email, password_hash, role, status)
values (
  'admin@muftahx.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi',
  'admin',
  'active'
)
on conflict (email) do nothing;

-- Additional owner admin account for Sharif.
insert into users (email, password_hash, role, status)
values (
  'sharifabdi735@gmail.com',
  '$2a$10$pm4ltjAZUXeuMcrqDt4jBeryAbveHBGYD2sgBSKygKbPy4BMz7qBi',
  'admin',
  'active'
)
on conflict (email) do update set
  password_hash = excluded.password_hash,
  role = 'admin',
  status = 'active';

-- ================================================================
-- DONE. Now go back to your terminal and run: npm run dev
-- Then open http://localhost:3000
-- Admin panel: http://localhost:3000/admin
-- Login: admin@muftahx.com / admin123
-- ================================================================
