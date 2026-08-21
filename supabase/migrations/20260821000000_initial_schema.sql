-- Rivera Cotizador: tenant isolation, immutable issued quotes and privacy workflows.

create extension if not exists pgcrypto;

create type public.organization_role as enum ('owner', 'admin', 'seller', 'viewer');
create type public.quote_status as enum ('draft', 'issued', 'accepted', 'expired', 'void');
create type public.price_mode as enum ('standard', 'offer');
create type public.privacy_request_type as enum ('access', 'rectification', 'deletion', 'opposition', 'portability');
create type public.privacy_request_status as enum ('received', 'in_review', 'completed', 'rejected');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 160),
  rut text,
  address text,
  city text,
  phone text,
  email text,
  default_tax_rate numeric(5, 2) not null default 19 check (default_tax_rate between 0 and 100),
  default_validity_days integer not null default 15 check (default_validity_days between 1 and 365),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.organization_role not null default 'viewer',
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  external_code text,
  name text not null check (char_length(name) between 2 and 180),
  rut text,
  address text,
  city text,
  phone text,
  email text,
  notes text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (organization_id, external_code)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  code text not null,
  description text not null check (char_length(description) between 2 and 500),
  standard_price bigint not null default 0 check (standard_price >= 0),
  offer_price bigint check (offer_price is null or offer_price >= 0),
  is_active boolean not null default true,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (organization_id, code)
);

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  quote_number text not null,
  status public.quote_status not null default 'draft',
  price_mode public.price_mode not null default 'standard',
  issued_on date not null default current_date,
  valid_until date not null,
  tax_rate numeric(5, 2) not null default 19 check (tax_rate between 0 and 100),
  client_id uuid references public.clients(id) on delete set null,
  client_name text not null,
  client_rut text,
  client_address text,
  client_city text,
  client_phone text,
  client_email text,
  notes text,
  subtotal bigint not null default 0 check (subtotal >= 0),
  tax_total bigint not null default 0 check (tax_total >= 0),
  total bigint not null default 0 check (total = subtotal + tax_total),
  created_by uuid not null references auth.users(id),
  issued_at timestamptz,
  accepted_at timestamptz,
  voided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, quote_number),
  check (valid_until >= issued_on)
);

create table public.quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  position integer not null check (position > 0),
  product_id uuid references public.products(id) on delete set null,
  product_code text,
  description text not null check (char_length(description) between 1 and 500),
  quantity numeric(12, 3) not null check (quantity > 0),
  unit_price bigint not null check (unit_price >= 0),
  net_amount bigint not null check (net_amount >= 0),
  tax_amount bigint not null check (tax_amount >= 0),
  total_amount bigint not null check (total_amount = net_amount + tax_amount),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (quote_id, position)
);

create table public.audit_events (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.privacy_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  requester_user_id uuid references auth.users(id) on delete set null,
  requester_email text not null,
  request_type public.privacy_request_type not null,
  status public.privacy_request_status not null default 'received',
  details text,
  resolution_note text,
  received_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index clients_organization_active_idx on public.clients (organization_id, name) where deleted_at is null;
create index products_organization_active_idx on public.products (organization_id, code) where deleted_at is null;
create index quotes_organization_status_idx on public.quotes (organization_id, status, issued_on desc);
create index quote_items_quote_idx on public.quote_items (quote_id, position);
create index quote_items_organization_idx on public.quote_items (organization_id, quote_id);
create index organization_members_user_idx on public.organization_members (user_id, organization_id);
create index quotes_client_idx on public.quotes (client_id) where client_id is not null;
create index audit_events_organization_created_idx on public.audit_events (organization_id, created_at desc);
create index privacy_requests_organization_status_idx on public.privacy_requests (organization_id, status, received_at desc);

create or replace function public.is_organization_member(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members
    where organization_id = target_organization_id
      and user_id = (select auth.uid())
  );
$$;

create or replace function public.has_organization_role(
  target_organization_id uuid,
  allowed_roles public.organization_role[]
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members
    where organization_id = target_organization_id
      and user_id = (select auth.uid())
      and role = any(allowed_roles)
  );
$$;

create or replace function public.create_organization(organization_name text, organization_rut text default null)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_organization_id uuid;
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication required';
  end if;

  insert into public.organizations (name, rut)
  values (trim(organization_name), nullif(trim(organization_rut), ''))
  returning id into new_organization_id;

  insert into public.organization_members (organization_id, user_id, role)
  values (new_organization_id, (select auth.uid()), 'owner');

  return new_organization_id;
end;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.recalculate_quote_totals()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_quote_id uuid := coalesce(new.quote_id, old.quote_id);
begin
  update public.quotes
  set subtotal = totals.net,
      tax_total = totals.tax,
      total = totals.net + totals.tax,
      updated_at = now()
  from (
    select
      coalesce(sum(net_amount), 0)::bigint as net,
      coalesce(sum(tax_amount), 0)::bigint as tax
    from public.quote_items
    where quote_id = target_quote_id
  ) totals
  where id = target_quote_id;

  return coalesce(new, old);
end;
$$;

create or replace function public.guard_issued_quote_items()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_quote_id uuid := coalesce(new.quote_id, old.quote_id);
  current_status public.quote_status;
  quote_organization_id uuid;
  quote_tax_rate numeric(5, 2);
  expected_net bigint;
  expected_tax bigint;
begin
  select status, organization_id, tax_rate
  into current_status, quote_organization_id, quote_tax_rate
  from public.quotes
  where id = target_quote_id;

  if current_status <> 'draft' then
    raise exception 'Issued quote items are immutable';
  end if;

  if tg_op <> 'DELETE' then
    if new.organization_id <> quote_organization_id then
      raise exception 'Quote item organization mismatch';
    end if;

    expected_net := round(new.quantity * new.unit_price)::bigint;
    expected_tax := round(expected_net * quote_tax_rate / 100)::bigint;

    if new.net_amount <> expected_net or
       new.tax_amount <> expected_tax or
       new.total_amount <> expected_net + expected_tax then
      raise exception 'Quote item totals do not reconcile';
    end if;
  end if;

  return coalesce(new, old);
end;
$$;

create or replace function public.guard_issued_quote()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not (
    (old.status = 'draft' and new.status in ('draft', 'issued', 'void')) or
    (old.status = 'issued' and new.status in ('issued', 'accepted', 'expired', 'void')) or
    (old.status = 'accepted' and new.status in ('accepted', 'void')) or
    (old.status = 'expired' and new.status in ('expired', 'void')) or
    (old.status = 'void' and new.status = 'void')
  ) then
    raise exception 'Invalid quote status transition from % to %', old.status, new.status;
  end if;

  if old.status <> 'draft' and (
    new.organization_id is distinct from old.organization_id or
    new.quote_number is distinct from old.quote_number or
    new.price_mode is distinct from old.price_mode or
    new.issued_on is distinct from old.issued_on or
    new.valid_until is distinct from old.valid_until or
    new.tax_rate is distinct from old.tax_rate or
    new.client_id is distinct from old.client_id or
    new.client_name is distinct from old.client_name or
    new.client_rut is distinct from old.client_rut or
    new.client_address is distinct from old.client_address or
    new.client_city is distinct from old.client_city or
    new.client_phone is distinct from old.client_phone or
    new.client_email is distinct from old.client_email or
    new.notes is distinct from old.notes or
    new.subtotal is distinct from old.subtotal or
    new.tax_total is distinct from old.tax_total or
    new.total is distinct from old.total
  ) then
    raise exception 'Issued quote content is immutable';
  end if;

  if old.status = 'draft' and new.status = 'issued' and new.issued_at is null then
    new.issued_at = now();
  elsif old.status = 'issued' and new.status = 'accepted' and new.accepted_at is null then
    new.accepted_at = now();
  elsif new.status = 'void' and old.status <> 'void' and new.voided_at is null then
    new.voided_at = now();
  end if;

  return new;
end;
$$;

create trigger organizations_updated_at before update on public.organizations for each row execute function public.set_updated_at();
create trigger clients_updated_at before update on public.clients for each row execute function public.set_updated_at();
create trigger products_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger quotes_guard before update on public.quotes for each row execute function public.guard_issued_quote();
create trigger quote_items_guard before insert or update or delete on public.quote_items for each row execute function public.guard_issued_quote_items();
create trigger quote_items_totals after insert or update or delete on public.quote_items for each row execute function public.recalculate_quote_totals();
create trigger privacy_requests_updated_at before update on public.privacy_requests for each row execute function public.set_updated_at();

create or replace function public.capture_audit_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  record_data jsonb := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  target_organization_id uuid;
  target_entity_id uuid;
  safe_metadata jsonb := '{}'::jsonb;
begin
  target_organization_id := (record_data ->> 'organization_id')::uuid;
  target_entity_id := (record_data ->> 'id')::uuid;

  if tg_table_name = 'quotes' then
    safe_metadata := jsonb_build_object(
      'quote_number', record_data ->> 'quote_number',
      'status', record_data ->> 'status'
    );
  elsif tg_table_name = 'products' then
    safe_metadata := jsonb_build_object('code', record_data ->> 'code');
  end if;

  insert into public.audit_events (
    organization_id,
    actor_user_id,
    action,
    entity_type,
    entity_id,
    metadata
  ) values (
    target_organization_id,
    (select auth.uid()),
    lower(tg_op),
    tg_table_name,
    target_entity_id,
    safe_metadata
  );

  return coalesce(new, old);
end;
$$;

create trigger clients_audit after insert or update on public.clients for each row execute function public.capture_audit_event();
create trigger products_audit after insert or update on public.products for each row execute function public.capture_audit_event();
create trigger quotes_audit after insert or update on public.quotes for each row execute function public.capture_audit_event();

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.clients enable row level security;
alter table public.products enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;
alter table public.audit_events enable row level security;
alter table public.privacy_requests enable row level security;

create policy organizations_select on public.organizations for select to authenticated using (public.is_organization_member(id));
create policy organizations_update on public.organizations for update to authenticated using (public.has_organization_role(id, array['owner', 'admin']::public.organization_role[])) with check (public.has_organization_role(id, array['owner', 'admin']::public.organization_role[]));

create policy members_select on public.organization_members for select to authenticated using (public.is_organization_member(organization_id));
create policy members_insert on public.organization_members for insert to authenticated with check (public.has_organization_role(organization_id, array['owner', 'admin']::public.organization_role[]));
create policy members_update on public.organization_members for update to authenticated using (public.has_organization_role(organization_id, array['owner', 'admin']::public.organization_role[])) with check (public.has_organization_role(organization_id, array['owner', 'admin']::public.organization_role[]));
create policy members_delete on public.organization_members for delete to authenticated using (public.has_organization_role(organization_id, array['owner', 'admin']::public.organization_role[]));

create policy clients_select on public.clients for select to authenticated using (public.is_organization_member(organization_id));
create policy clients_insert on public.clients for insert to authenticated with check (created_by = (select auth.uid()) and public.has_organization_role(organization_id, array['owner', 'admin', 'seller']::public.organization_role[]));
create policy clients_update on public.clients for update to authenticated using (public.has_organization_role(organization_id, array['owner', 'admin', 'seller']::public.organization_role[])) with check (public.has_organization_role(organization_id, array['owner', 'admin', 'seller']::public.organization_role[]));

create policy products_select on public.products for select to authenticated using (public.is_organization_member(organization_id));
create policy products_insert on public.products for insert to authenticated with check (created_by = (select auth.uid()) and public.has_organization_role(organization_id, array['owner', 'admin', 'seller']::public.organization_role[]));
create policy products_update on public.products for update to authenticated using (public.has_organization_role(organization_id, array['owner', 'admin', 'seller']::public.organization_role[])) with check (public.has_organization_role(organization_id, array['owner', 'admin', 'seller']::public.organization_role[]));

create policy quotes_select on public.quotes for select to authenticated using (public.is_organization_member(organization_id));
create policy quotes_insert on public.quotes for insert to authenticated with check (created_by = (select auth.uid()) and public.has_organization_role(organization_id, array['owner', 'admin', 'seller']::public.organization_role[]));
create policy quotes_update on public.quotes for update to authenticated using (public.has_organization_role(organization_id, array['owner', 'admin', 'seller']::public.organization_role[])) with check (public.has_organization_role(organization_id, array['owner', 'admin', 'seller']::public.organization_role[]));

create policy quote_items_select on public.quote_items for select to authenticated using (public.is_organization_member(organization_id));
create policy quote_items_insert on public.quote_items for insert to authenticated with check (public.has_organization_role(organization_id, array['owner', 'admin', 'seller']::public.organization_role[]));
create policy quote_items_update on public.quote_items for update to authenticated using (public.has_organization_role(organization_id, array['owner', 'admin', 'seller']::public.organization_role[])) with check (public.has_organization_role(organization_id, array['owner', 'admin', 'seller']::public.organization_role[]));
create policy quote_items_delete on public.quote_items for delete to authenticated using (public.has_organization_role(organization_id, array['owner', 'admin', 'seller']::public.organization_role[]));

create policy audit_events_select on public.audit_events for select to authenticated using (public.has_organization_role(organization_id, array['owner', 'admin']::public.organization_role[]));

create policy privacy_requests_select on public.privacy_requests for select to authenticated using (requester_user_id = (select auth.uid()) or public.has_organization_role(organization_id, array['owner', 'admin']::public.organization_role[]));
create policy privacy_requests_insert on public.privacy_requests for insert to authenticated with check (requester_user_id = (select auth.uid()) and public.is_organization_member(organization_id));
create policy privacy_requests_update on public.privacy_requests for update to authenticated using (public.has_organization_role(organization_id, array['owner', 'admin']::public.organization_role[])) with check (public.has_organization_role(organization_id, array['owner', 'admin']::public.organization_role[]));

grant usage on schema public to authenticated;
grant select, insert, update on public.organizations, public.organization_members, public.clients, public.products, public.quotes, public.quote_items, public.privacy_requests to authenticated;
grant delete on public.organization_members, public.quote_items to authenticated;
grant select on public.audit_events to authenticated;
grant execute on function public.create_organization(text, text) to authenticated;
revoke all on function public.is_organization_member(uuid) from public;
revoke all on function public.has_organization_role(uuid, public.organization_role[]) from public;
grant execute on function public.is_organization_member(uuid) to authenticated;
grant execute on function public.has_organization_role(uuid, public.organization_role[]) to authenticated;
