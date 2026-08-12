create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_full_name_not_blank
    check (full_name is null or btrim(full_name) <> ''),
  constraint profiles_avatar_url_not_blank
    check (avatar_url is null or btrim(avatar_url) <> '')
);
comment on table public.profiles is
  'Application profile keyed by auth.users.id.';
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := statement_timestamp();
  return new;
end;
$$;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();
revoke all on function public.set_updated_at() from public;
