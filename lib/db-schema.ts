/**
 * The database schema, in one place.
 *
 * `lib/db.ts` applies this automatically the first time a deployment talks to
 * the database, so you normally never run it by hand. It is kept as a plain
 * string (not a .sql file) so the serverless bundle always contains it, and it
 * is exported so `scripts/db-migrate.ts` can apply or print the same thing.
 *
 * Everything is `if not exists` / idempotent: running it twice is harmless.
 */

export const SCHEMA_VERSION = 1

export const SCHEMA_SQL = `
create table if not exists genie_schema (
  version    integer primary key,
  applied_at timestamptz not null default now()
);

create table if not exists genie_meta (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);

create table if not exists genie_products (
  slug         text primary key,
  published    boolean not null default true,
  featured     boolean not null default false,
  name         text not null,
  maker        text not null,
  collection   text not null,
  price        numeric(10, 2) not null default 0,
  score        integer not null default 0,
  badge        text,
  verdict      text not null default '',
  best_for     text not null default '',
  summary      text not null default '',
  image        text not null default '',
  tested_hours integer not null default 0,
  updated      date,
  pros         jsonb not null default '[]'::jsonb,
  cons         jsonb not null default '[]'::jsonb,
  specs        jsonb not null default '[]'::jsonb,
  scores       jsonb not null default '[]'::jsonb,
  retailers    jsonb not null default '[]'::jsonb,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint genie_products_collection_check
    check (collection in ('audio', 'desk', 'home'))
);

create index if not exists genie_products_collection_idx
  on genie_products (collection, sort_order);

create index if not exists genie_products_published_idx
  on genie_products (published, sort_order);

create table if not exists genie_subscribers (
  id         bigserial primary key,
  email      text not null,
  source     text not null default 'site',
  created_at timestamptz not null default now()
);

-- One row per address, case-insensitively.
create unique index if not exists genie_subscribers_email_idx
  on genie_subscribers (lower(email));

create index if not exists genie_subscribers_created_idx
  on genie_subscribers (created_at desc);
`
