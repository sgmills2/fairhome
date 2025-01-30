# Environment Setup

## Local Development

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Fill in the environment variables:
- Public keys (safe to commit):
  - `VITE_MAPBOX_TOKEN`: Your Mapbox API token
  - `VITE_SUPABASE_URL`: Your Supabase project URL
  - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
  - `VITE_MAPILLARY_ACCESS_TOKEN`: Your Mapillary access token

- Admin keys (never commit these):
  - `SUPABASE_SERVICE_KEY`: Your Supabase service role key (only needed for admin scripts)
    - Get this from your team lead or Supabase dashboard
    - Only needed when running data upload scripts
    - Keep this secure and never commit it

## Security Notes

- The `.env` file is ignored by git to prevent accidental commits of sensitive data
- Only use the service role key locally for admin tasks
- Never commit sensitive keys or tokens
- If you accidentally commit sensitive data:
  1. Rotate (change) the affected keys immediately
  2. Contact your team lead
  3. Update your local `.env` with the new keys 