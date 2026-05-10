alter table registrations add column if not exists export_capacity text;

create table if not exists seller_products (
  id                 uuid primary key default gen_random_uuid(),
  seller_email       text not null,
  auth_user_id       uuid,
  product_name       text not null,
  category           text,
  grade              text,
  volume             text,
  packaging          text,
  destination_market text,
  photo_url          text,
  status             text not null default 'draft' check (status in ('draft','submitted','approved','rejected')),
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

alter table seller_products enable row level security;

create index if not exists idx_seller_products_email on seller_products(seller_email);
create index if not exists idx_seller_products_status on seller_products(status);
