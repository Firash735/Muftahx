-- Make this migration safe to run on an existing MuftahX Supabase project.
drop policy if exists "public_insert_registrations" on registrations;
drop policy if exists "public_read_exporters" on exporters;

create policy "public_insert_registrations"
  on registrations for insert with check (true);

create policy "public_read_exporters"
  on exporters for select using (true);

insert into users (email, password_hash, role, status)
values (
  'sharifabdi735@gmail.com',
  '$2a$10$0DjGUzPwI6clpjUL.sB6oOmU9NAuF0RgiitfzAial8Etxg8a7DVmu',
  'admin',
  'active'
)
on conflict (email) do update set
  password_hash = excluded.password_hash,
  role = 'admin',
  status = 'active';
