-- Coverwise: comparison sessions, consent records and provider responses.
-- All tables are service-role only. No anon or authenticated policies exist,
-- so RLS denies every client-side read and write by default.

create extension if not exists "pgcrypto";

create table if not exists public.comparisons (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  mode text not null check (mode in ('demo', 'live')),
  application jsonb not null,
  providers jsonb not null,
  -- Retention: demonstration sessions are purged after 30 days (see purge function).
  expires_at timestamptz not null default (now() + interval '30 days')
);

create table if not exists public.consent_records (
  id uuid primary key default gen_random_uuid(),
  comparison_id uuid not null references public.comparisons (id) on delete cascade,
  consented_at timestamptz not null,
  share_with_providers boolean not null,
  acknowledge_demonstration boolean not null,
  providers_shared text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.provider_responses (
  id uuid primary key default gen_random_uuid(),
  comparison_id uuid not null references public.comparisons (id) on delete cascade,
  provider_id text not null,
  status text not null check (
    status in (
      'NOT_CONNECTED','READY','SUBMITTED','QUOTING','QUOTED',
      'REFERRED','DECLINED','ERROR','MANUAL_ACTION_REQUIRED'
    )
  ),
  attempt integer not null default 1,
  received_at timestamptz not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  unique (comparison_id, provider_id)
);

create index if not exists provider_responses_comparison_idx
  on public.provider_responses (comparison_id);
create index if not exists comparisons_expires_idx
  on public.comparisons (expires_at);

alter table public.comparisons enable row level security;
alter table public.consent_records enable row level security;
alter table public.provider_responses enable row level security;

-- Deliberately no policies: only the service role can access these rows.
revoke all on public.comparisons from anon, authenticated;
revoke all on public.consent_records from anon, authenticated;
revoke all on public.provider_responses from anon, authenticated;

-- Data deletion workflow: purge expired sessions. Schedule with pg_cron
-- (e.g. daily) or call from a maintenance job.
create or replace function public.purge_expired_comparisons()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted integer;
begin
  delete from public.comparisons where expires_at < now();
  get diagnostics deleted = row_count;
  return deleted;
end;
$$;

revoke all on function public.purge_expired_comparisons() from public, anon, authenticated;
