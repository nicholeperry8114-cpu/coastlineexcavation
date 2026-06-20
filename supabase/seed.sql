insert into leads (
  customer_name,
  email,
  phone,
  job_type,
  property_address,
  project_description,
  notes,
  status
)
values
  (
    'Harbor Point HOA',
    'manager@harborpoint.example',
    '(555) 201-0101',
    'Drainage and grading',
    '1180 Harbor Point Drive, Charleston, SC',
    'Regrade parking lot edge and install drainage swale near Building C.',
    'Requested site visit after morning high tide.',
    'proposal_drafted'
  ),
  (
    'Mason Carter',
    'mason.carter@example.com',
    '(555) 201-0102',
    'Driveway excavation',
    '42 Sandpiper Lane, Mount Pleasant, SC',
    'Remove existing gravel driveway and prep for concrete apron.',
    'Customer prefers text updates.',
    'contacted'
  ),
  (
    'Lowcountry Builders',
    'ops@lowcountrybuilders.example',
    '(555) 201-0103',
    'Foundation prep',
    '73 Palmetto Ridge Road, Summerville, SC',
    'Excavate and compact pad for detached garage foundation.',
    null,
    'new'
  );

with target_lead as (
  select id from leads where customer_name = 'Harbor Point HOA' limit 1
),
created_proposal as (
  insert into proposals (
    lead_id,
    proposal_date,
    expiration_date,
    scope_of_work,
    status
  )
  select
    id,
    current_date,
    current_date + interval '14 days',
    'Mobilize equipment, establish erosion controls, regrade affected area, install drainage swale, compact disturbed soils, and remove debris from site.',
    'pending'
  from target_lead
  returning id
)
insert into proposal_line_items (proposal_id, sort_order, description, quantity, unit_price_cents)
select id, 1, 'Mobilization and site protection', 1, 85000 from created_proposal
union all
select id, 2, 'Drainage swale excavation and grading', 1, 420000 from created_proposal
union all
select id, 3, 'Debris haul-off and cleanup', 1, 65000 from created_proposal;

with accepted_lead as (
  insert into leads (
    customer_name,
    email,
    phone,
    job_type,
    property_address,
    project_description,
    notes,
    status
  )
  values (
    'Elliot Marsh',
    'elliot.marsh@example.com',
    '(555) 201-0104',
    'Pool excavation',
    '905 Oceanview Court, Isle of Palms, SC',
    'Backyard excavation for fiberglass pool installation.',
    'Narrow side yard access; verify equipment width.',
    'closed'
  )
  returning id, customer_name, email, phone, property_address
),
accepted_proposal as (
  insert into proposals (
    lead_id,
    proposal_date,
    expiration_date,
    scope_of_work,
    status,
    accepted_at
  )
  select
    id,
    current_date - interval '7 days',
    current_date + interval '7 days',
    'Excavate pool area to builder specifications, stockpile clean fill onsite, and haul excess material.',
    'accepted',
    now() - interval '2 days'
  from accepted_lead
  returning id
),
accepted_items as (
  insert into proposal_line_items (proposal_id, sort_order, description, quantity, unit_price_cents)
  select id, 1, 'Pool excavation package', 1, 735000 from accepted_proposal
  returning proposal_id
),
created_job as (
  insert into jobs (
    proposal_id,
    customer_name,
    email,
    phone,
    property_address,
    notes,
    status
  )
  select
    accepted_proposal.id,
    accepted_lead.customer_name,
    accepted_lead.email,
    accepted_lead.phone,
    accepted_lead.property_address,
    'Coordinate schedule with pool installer.',
    'active'
  from accepted_proposal, accepted_lead
  returning id
),
created_invoice as (
  insert into invoices (
    job_id,
    invoice_date,
    due_date,
    deposit_received_cents,
    status,
    sent_at
  )
  select id, current_date, current_date + interval '15 days', 200000, 'sent', now()
  from created_job
  returning id
)
insert into invoice_line_items (invoice_id, sort_order, description, quantity, unit_price_cents)
select id, 1, 'Pool excavation progress billing', 1, 735000 from created_invoice;

insert into activity_events (entity_type, entity_id, action, description)
select 'lead', id, 'created', 'Seed lead imported for demo dashboard'
from leads;
