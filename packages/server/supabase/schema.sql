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
  developer_id uuid references public.developers(id) null,
  title text not null,
  description text,
  address text not null unique,
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

-- Create function to get listings with coordinates
create or replace function get_listings_with_coordinates()
returns table (
  id uuid,
  developer_id uuid,
  title text,
  description text,
  address text,
  latitude double precision,
  longitude double precision,
  price numeric,
  bedrooms smallint,
  bathrooms smallint,
  square_feet numeric,
  photos text[],
  amenities text[],
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) language plpgsql
as $$
begin
  return query
  select 
    l.id,
    l.developer_id,
    l.title,
    l.description,
    l.address,
    ST_Y(l.location::geometry) as latitude,
    ST_X(l.location::geometry) as longitude,
    l.price,
    l.bedrooms,
    l.bathrooms,
    l.square_feet,
    l.photos,
    l.amenities,
    l.created_at,
    l.updated_at
  from listings l;
end;
$$;

-- Enable RLS (Row Level Security)
alter table if exists public.developers enable row level security;
alter table if exists public.listings enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Listings are viewable by everyone" on public.listings;
drop policy if exists "Listings are insertable by everyone" on public.listings;
drop policy if exists "Listings are updatable by everyone" on public.listings;

-- Create public access policies
create policy "Listings are viewable by everyone" 
  on public.listings for select
  using (true);

create policy "Listings are insertable by everyone" 
  on public.listings for insert
  with check (true);

create policy "Listings are updatable by everyone" 
  on public.listings for update
  using (true); 