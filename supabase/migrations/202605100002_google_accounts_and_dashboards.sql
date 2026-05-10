alter table registrations add column if not exists auth_user_id uuid;
alter table registrations add column if not exists signup_provider text default 'manual';

create table if not exists platform_accounts (
  id              uuid primary key default gen_random_uuid(),
  auth_user_id    uuid unique,
  email           text not null unique,
  full_name       text,
  role            text not null check (role in ('seller','buyer')),
  signup_provider text not null default 'google',
  status          text not null default 'active' check (status in ('active','pending_review','rejected')),
  last_login_at   timestamptz default now(),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table platform_accounts enable row level security;

create index if not exists idx_reg_auth_user on registrations(auth_user_id);
create index if not exists idx_platform_role on platform_accounts(role);
create index if not exists idx_platform_email on platform_accounts(email);
