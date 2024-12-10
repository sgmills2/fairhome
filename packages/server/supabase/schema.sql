-- Enable PostGIS for location-based queries
create extension if not exists postgis;

-- Create tables
create table if not exists public.developers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.listings (
  id uuid default gen_random_uuid() primary key,
  developer_id uuid references public.developers(id),
  title text not null,
  description text,
  address text not null,
  location geography(Point, 4326) not null,
  price numeric not null,
  bedrooms smallint not null,
  bathrooms smallint not null,
  square_feet numeric not null,
  photos text[] default array[]::text[],
  amenities text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table if exists public.developers enable row level security;
alter table if exists public.listings enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Listings are viewable by everyone" on public.listings;
drop policy if exists "Developers can insert their own listings" on public.listings;
drop policy if exists "Developers can update their own listings" on public.listings;

-- Create policies
create policy "Listings are viewable by everyone" on public.listings
  for select using (true);

create policy "Developers can insert their own listings" on public.listings
  for insert with check (auth.uid() = developer_id);

create policy "Developers can update their own listings" on public.listings
  for update using (auth.uid() = developer_id); 