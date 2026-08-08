-- Jalankan di Supabase: Dashboard > SQL Editor > New query > paste ini > Run

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  gmail text not null,
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  role text not null,       -- 'user' atau 'assistant'
  content text not null,
  created_at timestamptz default now()
);
