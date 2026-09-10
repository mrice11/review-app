-- Run this once in the Supabase SQL editor (see README.md step 2).

create table bookings (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  event_date date not null,
  status text not null default 'awaiting', -- awaiting | sent | reviewed | flagged
  feedback text,
  created_at timestamp with time zone default now()
);

-- Allow the app to read and write bookings.
-- (For a single-business MVP this is fine; when you add multiple
-- businesses later, this is the part we'll lock down per-account.)
alter table bookings enable row level security;

create policy "Allow all access for now"
  on bookings
  for all
  using (true)
  with check (true);
