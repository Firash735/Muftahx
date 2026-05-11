create table if not exists buyer_requests (
  id                 uuid primary key default gen_random_uuid(),
  buyer_email        text not null,
  auth_user_id       uuid,
  company_name       text,
  country            text,
  product_interest   text not null,
  volume             text,
  destination_market text,
  timeline           text,
  certification_need text,
  notes              text,
  status             text not null default 'new' check (status in ('new','matched','contacted','closed','rejected')),
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

alter table buyer_requests enable row level security;

create index if not exists idx_buyer_requests_email on buyer_requests(buyer_email);
create index if not exists idx_buyer_requests_status on buyer_requests(status);
