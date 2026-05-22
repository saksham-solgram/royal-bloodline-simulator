-- Royal Bloodline Simulator
-- Uses bloodline_* table names so we don't clash with existing public.players / rooms tables.

create extension if not exists "uuid-ossp";

create table if not exists bloodline_rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text unique not null,
  current_generation int not null default 0,
  game_state text not null default 'lobby',
  is_started boolean not null default false,
  is_paused boolean not null default false,
  phase_deadline timestamptz,
  max_generations int not null default 5,
  sync_token int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists bloodline_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references bloodline_rooms(id) on delete cascade,
  name text not null,
  dynasty_health int not null default 100,
  political_power int not null default 50,
  inbreeding_risk int not null default 0,
  prestige int not null default 0,
  score int not null default 0,
  current_heir text default 'Heir I',
  is_alive boolean not null default true,
  last_outcome text,
  has_chosen boolean not null default false,
  created_at timestamptz not null default now(),
  unique (room_id, name)
);

create table if not exists bloodline_choices (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references bloodline_players(id) on delete cascade,
  room_id uuid not null references bloodline_rooms(id) on delete cascade,
  generation int not null,
  candidate_id text not null,
  candidate_name text,
  outcome text,
  created_at timestamptz not null default now(),
  unique (player_id, generation)
);

create index if not exists idx_bloodline_players_room on bloodline_players(room_id);
create index if not exists idx_bloodline_choices_room_gen on bloodline_choices(room_id, generation);

alter table bloodline_rooms enable row level security;
alter table bloodline_players enable row level security;
alter table bloodline_choices enable row level security;

drop policy if exists "bloodline_rooms_public" on bloodline_rooms;
drop policy if exists "bloodline_players_public" on bloodline_players;
drop policy if exists "bloodline_choices_public" on bloodline_choices;

create policy "bloodline_rooms_public" on bloodline_rooms for all using (true) with check (true);
create policy "bloodline_players_public" on bloodline_players for all using (true) with check (true);
create policy "bloodline_choices_public" on bloodline_choices for all using (true) with check (true);

-- Realtime (ignore errors if already added)
do $$
begin
  alter publication supabase_realtime add table bloodline_rooms;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table bloodline_players;
exception when duplicate_object then null;
end $$;
