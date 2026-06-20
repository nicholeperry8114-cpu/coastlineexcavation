create extension if not exists pgcrypto;

create type admin_role as enum ('admin');
create type lead_status as enum ('new', 'contacted', 'proposal_drafted', 'closed');
create type proposal_status as enum ('draft', 'pending', 'accepted', 'rejected');
create type job_status as enum ('active', 'final_payment_due', 'completed');
create type invoice_status as enum ('draft', 'sent', 'paid');

create sequence lead_number_seq start 1;
create sequence proposal_number_seq start 1;
create sequence job_number_seq start 1;
create sequence invoice_number_seq start 1;

create or replace function next_lead_number()
returns text
language sql
as $$
  select 'LEAD-' || lpad(nextval('lead_number_seq')::text, 6, '0');
$$;

create or replace function next_proposal_number()
returns text
language sql
as $$
  select 'PROP-' || lpad(nextval('proposal_number_seq')::text, 6, '0');
$$;

create or replace function next_job_number()
returns text
language sql
as $$
  select 'JOB-' || lpad(nextval('job_number_seq')::text, 6, '0');
$$;

create or replace function next_invoice_number()
returns text
language sql
as $$
  select 'INV-' || lpad(nextval('invoice_number_seq')::text, 6, '0');
$$;

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role admin_role not null default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data->>'full_name', ''),
    'admin'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

create table leads (
  id uuid primary key default gen_random_uuid(),
  lead_number text not null unique default next_lead_number(),
  customer_name text not null,
  email text not null,
  phone text not null,
  job_type text not null,
  property_address text not null,
  project_description text,
  notes text,
  status lead_status not null default 'new',
  created_by uuid references profiles(id),
  updated_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table lead_attachments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  bucket text not null default 'lead-attachments',
  storage_path text not null,
  file_name text not null,
  file_type text,
  file_size bigint,
  uploaded_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table proposals (
  id uuid primary key default gen_random_uuid(),
  proposal_number text not null unique default next_proposal_number(),
  lead_id uuid not null references leads(id),
  proposal_date date not null default current_date,
  expiration_date date not null,
  scope_of_work text not null,
  subtotal_cents integer not null default 0 check (subtotal_cents >= 0),
  total_cents integer not null default 0 check (total_cents >= 0),
  status proposal_status not null default 'draft',
  public_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  public_token_expires_at timestamptz,
  accepted_at timestamptz,
  rejected_at timestamptz,
  customer_response_ip text,
  created_by uuid references profiles(id),
  updated_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table proposal_line_items (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references proposals(id) on delete cascade,
  sort_order integer not null default 0,
  description text not null,
  quantity numeric(10, 2) not null default 1 check (quantity > 0),
  unit_price_cents integer not null default 0 check (unit_price_cents >= 0),
  total_cents integer not null default 0 check (total_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table jobs (
  id uuid primary key default gen_random_uuid(),
  job_number text not null unique default next_job_number(),
  proposal_id uuid not null unique references proposals(id),
  customer_name text not null,
  email text not null,
  phone text not null,
  property_address text not null,
  notes text,
  status job_status not null default 'active',
  created_by uuid references profiles(id),
  updated_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique default next_invoice_number(),
  job_id uuid not null references jobs(id),
  invoice_date date not null default current_date,
  due_date date not null,
  deposit_received_cents integer not null default 0 check (deposit_received_cents >= 0),
  subtotal_cents integer not null default 0 check (subtotal_cents >= 0),
  total_amount_cents integer not null default 0 check (total_amount_cents >= 0),
  remaining_balance_cents integer not null default 0 check (remaining_balance_cents >= 0),
  status invoice_status not null default 'draft',
  public_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  sent_at timestamptz,
  paid_at timestamptz,
  created_by uuid references profiles(id),
  updated_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table invoice_line_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  sort_order integer not null default 0,
  description text not null,
  quantity numeric(10, 2) not null default 1 check (quantity > 0),
  unit_price_cents integer not null default 0 check (unit_price_cents >= 0),
  total_cents integer not null default 0 check (total_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table activity_events (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  description text,
  actor_id uuid references profiles(id),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create or replace function calculate_line_item_total()
returns trigger
language plpgsql
as $$
begin
  new.total_cents = round(new.quantity * new.unit_price_cents)::integer;
  return new;
end;
$$;

create or replace function recalculate_proposal_totals(target_proposal_id uuid)
returns void
language plpgsql
as $$
begin
  update proposals
  set
    subtotal_cents = coalesce((select sum(total_cents) from proposal_line_items where proposal_id = target_proposal_id), 0),
    total_cents = coalesce((select sum(total_cents) from proposal_line_items where proposal_id = target_proposal_id), 0),
    updated_at = now()
  where id = target_proposal_id;
end;
$$;

create or replace function recalculate_invoice_totals(target_invoice_id uuid)
returns void
language plpgsql
as $$
declare
  calculated_total integer;
begin
  select coalesce(sum(total_cents), 0)
  into calculated_total
  from invoice_line_items
  where invoice_id = target_invoice_id;

  update invoices
  set
    subtotal_cents = calculated_total,
    total_amount_cents = calculated_total,
    remaining_balance_cents = greatest(calculated_total - deposit_received_cents, 0),
    updated_at = now()
  where id = target_invoice_id;
end;
$$;

create or replace function after_proposal_line_item_change()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    perform recalculate_proposal_totals(old.proposal_id);
  else
    perform recalculate_proposal_totals(new.proposal_id);
  end if;

  return null;
end;
$$;

create or replace function after_invoice_line_item_change()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    perform recalculate_invoice_totals(old.invoice_id);
  else
    perform recalculate_invoice_totals(new.invoice_id);
  end if;

  return null;
end;
$$;

create or replace function recalculate_invoice_balance()
returns trigger
language plpgsql
as $$
begin
  new.remaining_balance_cents = greatest(new.total_amount_cents - new.deposit_received_cents, 0);
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on profiles
  for each row execute function set_updated_at();
create trigger leads_set_updated_at before update on leads
  for each row execute function set_updated_at();
create trigger proposals_set_updated_at before update on proposals
  for each row execute function set_updated_at();
create trigger proposal_line_items_set_updated_at before update on proposal_line_items
  for each row execute function set_updated_at();
create trigger jobs_set_updated_at before update on jobs
  for each row execute function set_updated_at();
create trigger invoices_set_updated_at before update on invoices
  for each row execute function set_updated_at();
create trigger invoice_line_items_set_updated_at before update on invoice_line_items
  for each row execute function set_updated_at();

create trigger proposal_line_items_calculate_total before insert or update on proposal_line_items
  for each row execute function calculate_line_item_total();
create trigger invoice_line_items_calculate_total before insert or update on invoice_line_items
  for each row execute function calculate_line_item_total();
create trigger proposal_line_items_recalculate_totals after insert or update or delete on proposal_line_items
  for each row execute function after_proposal_line_item_change();
create trigger invoice_line_items_recalculate_totals after insert or update or delete on invoice_line_items
  for each row execute function after_invoice_line_item_change();
create trigger invoices_recalculate_balance before insert or update of deposit_received_cents, total_amount_cents on invoices
  for each row execute function recalculate_invoice_balance();

create index leads_status_idx on leads(status);
create index leads_created_at_idx on leads(created_at desc);
create index leads_search_idx on leads using gin (
  to_tsvector('english', customer_name || ' ' || email || ' ' || phone || ' ' || property_address || ' ' || coalesce(job_type, ''))
);
create index lead_attachments_lead_id_idx on lead_attachments(lead_id);
create index proposals_lead_id_idx on proposals(lead_id);
create index proposals_status_idx on proposals(status);
create index proposals_public_token_idx on proposals(public_token);
create index jobs_status_idx on jobs(status);
create index jobs_proposal_id_idx on jobs(proposal_id);
create index invoices_job_id_idx on invoices(job_id);
create index invoices_status_idx on invoices(status);
create index invoices_public_token_idx on invoices(public_token);
create index activity_events_entity_idx on activity_events(entity_type, entity_id);

alter table profiles enable row level security;
alter table leads enable row level security;
alter table lead_attachments enable row level security;
alter table proposals enable row level security;
alter table proposal_line_items enable row level security;
alter table jobs enable row level security;
alter table invoices enable row level security;
alter table invoice_line_items enable row level security;
alter table activity_events enable row level security;

create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create policy "Admins can view profiles" on profiles
  for select using (is_admin() or id = auth.uid());
create policy "Admins can update own profile" on profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy "Admins can manage leads" on leads
  for all using (is_admin()) with check (is_admin());
create policy "Admins can manage lead attachments" on lead_attachments
  for all using (is_admin()) with check (is_admin());
create policy "Admins can manage proposals" on proposals
  for all using (is_admin()) with check (is_admin());
create policy "Admins can manage proposal line items" on proposal_line_items
  for all using (is_admin()) with check (is_admin());
create policy "Admins can manage jobs" on jobs
  for all using (is_admin()) with check (is_admin());
create policy "Admins can manage invoices" on invoices
  for all using (is_admin()) with check (is_admin());
create policy "Admins can manage invoice line items" on invoice_line_items
  for all using (is_admin()) with check (is_admin());
create policy "Admins can view activity" on activity_events
  for select using (is_admin());
create policy "Admins can create activity" on activity_events
  for insert with check (is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lead-attachments',
  'lead-attachments',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Admins can view lead attachment objects" on storage.objects
  for select using (bucket_id = 'lead-attachments' and is_admin());
create policy "Admins can upload lead attachment objects" on storage.objects
  for insert with check (bucket_id = 'lead-attachments' and is_admin());
create policy "Admins can update lead attachment objects" on storage.objects
  for update using (bucket_id = 'lead-attachments' and is_admin()) with check (bucket_id = 'lead-attachments' and is_admin());
create policy "Admins can delete lead attachment objects" on storage.objects
  for delete using (bucket_id = 'lead-attachments' and is_admin());
