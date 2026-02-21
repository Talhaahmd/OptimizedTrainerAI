# Optimize Me Backend

Production-ready Node.js backend using Fastify, Supabase, and OpenAI.

## Features
- **Fastify Framework**: High-performance, low-overhead.
- **Supabase Integration**: Auth, Postgres, Storage, and RLS.
- **Modular AI Logic**: Mifflin-St Jeor target calculation and OpenAI tool-calling chat.
- **Secure Endpoints**: JWT-validated access with derive `user_id` from token.
- **Audit Logging**: AI actions and interactions are logged.

## Setup

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env` and fill in your keys.

3. **Supabase Migrations**:
   Run the SQL in `supabase/migrations/20260221183000_init_schema.sql` via the Supabase SQL Editor.

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

## Endpoints
- `GET /health` — Simple health check.
- `GET /v1/me` — Current profile, targets, and today's summary.
- `POST /v1/profile` — Upsert profile and recompute targets.
- `POST /v1/stats/steps` — Log steps.
- `POST /v1/stats/sleep` — Log sleep.
- `POST /v1/stats/weight` — Log weight (updates profile).
- `POST /v1/meals/camera/create-draft` — Vision analysis for meal logging.
- `POST /v1/chat/message` — Context-aware AI chat with tool support.
