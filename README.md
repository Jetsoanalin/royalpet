# Royal Pet Clinic (Full Stack)

This workspace contains a complete **full-stack** Royal Pet Clinic application.

- **Client:** React + Vite app (`/client`) with the full UI and workflow.
- **Server:** Express API with a **real database** (SQLite by default, pluggable to Postgres via `DATABASE_URL`) (`/server`).
- **Storage:** Local uploads in development, with S3-compatible object storage support for production image/CDN delivery.

---

## ✅ Key Features

- **Real database** using SQLite (default), with schema and seeds generated via Knex.
- **Multi-user auth** via JWT tokens + role-based access control (admin/doctor/receptionist/owner).
- **Separate environments** via `.env` configuration and `NODE_ENV`.
- **API-backed session restore and bootstrap** so the client hydrates from the persistent database after login.
- **Background server sync** from the existing UI save flow for staff-side CRUD screens.
- **Owner self-service appointment requests** persisted through the API.
- **Pluggable image storage** with a cost-effective long-term production path using S3-compatible storage.

## 🚀 Production Deployment

### Option A — Vercel + Appwrite (recommended for serverless)

**Architecture:** React SPA on Vercel CDN, Express API as Vercel Serverless Functions, data in Appwrite Databases, images in Appwrite Storage.

#### 1) Provision Appwrite (one time)

Create a project at [Appwrite Cloud](https://cloud.appwrite.io), generate an **API key** with Databases + Storage scopes, then:

```bash
cd server
cp .env.example .env   # fill APPWRITE_* and JWT_SECRET
npm install
npm run setup:appwrite
```

This creates collections, a storage bucket, and seeds default users.

#### 2) Deploy to Vercel

Connect the repo to Vercel. Set environment variables from `.env.example` (root or server):

| Variable | Purpose |
|----------|---------|
| `JWT_SECRET` | Auth signing |
| `DATABASE_PROVIDER` | `appwrite` |
| `APPWRITE_ENDPOINT` | e.g. `https://sgp.cloud.appwrite.io/v1` |
| `APPWRITE_PROJECT_ID` | e.g. `69cb82450038c7fe298c` |
| `APPWRITE_API_KEY` | Server-side API key (never expose to client) |
| `APPWRITE_DATABASE_ID` | `royalpetshop` |
| `APPWRITE_BUCKET_ID` | `royalpet-images` (default) |
| `STORAGE_PROVIDER` | `appwrite` |
| `STORAGE_PUBLIC_BASE_URL` | Public URL prefix for uploaded images |
| `CORS_ORIGINS` | Your Vercel URL |
| `CRON_SECRET` | Random string for nightly backup cron |
| `ALLOW_BULK_SYNC` | `true` |

Vercel uses `vercel.json` to build the client, bundle the API, and run nightly backups at 2 AM via `/api/cron/backup`.

#### 3) Local dev with Appwrite

```bash
# Terminal 1 — API
cd server && npm run dev

# Terminal 2 — client (proxies /api to :4000)
cd client && npm run dev
```

Set `DATABASE_PROVIDER=appwrite` and Appwrite env vars in `server/.env`.

---

### Option B — Render monolith (SQLite / Postgres)

#### 1) Build the client

```bash
cd client
npm install
npm run build
```

#### 2) Start the server in production

```bash
cd server
npm install
npm run migrate
npm run seed
NODE_ENV=production npm start
```

The server will serve the built client at **http://localhost:4000** and handle all API requests.

### Environment Variables

Create `server/.env`:
```
JWT_SECRET=your-super-secret-jwt-key-here
DATABASE_URL=sqlite://server/data/royalpet.db  # or postgres://... for production DB
ALLOW_BULK_SYNC=true

# Local uploads (default)
STORAGE_PROVIDER=local

# Recommended production image setup: Cloudflare R2 + CDN/custom domain
# STORAGE_PROVIDER=s3
# S3_BUCKET=royalpet-images
# S3_REGION=auto
# S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
# S3_ACCESS_KEY_ID=...
# S3_SECRET_ACCESS_KEY=...
# S3_PUBLIC_BASE_URL=https://images.yourdomain.com
```

---

### Manage database

```bash
cd server
npm run migrate    # Apply schema
npm run seed       # Seed initial data
npm run reset-db   # Drop + rebuild + seed
```

---

## 🔐 Auth

Use the seeded users:

- `admin@royalpet.com` / `Admin@123` (Admin)
- `doctor@royalpet.com` / `Doctor@123` (Doctor)
- `staff@royalpet.com` / `Staff@123` (Receptionist)
- `owner@royalpet.com` / `Owner@123` (Pet Owner)

---

## 🚀 Deploying

1. Build client:
   ```bash
   cd client
   npm run build
   ```
2. Configure your environment variables (`PORT`, `JWT_SECRET`, `DATABASE_URL`).
3. Start server in production mode:
   ```bash
   cd server
   npm start
   ```

---

## Next Improvements (Optional)
- Add WebSocket or SSE updates for truly live multi-user refresh across tabs/devices.
- Break the large client page into feature modules and dedicated API hooks.
- Add image metadata tables if you want pet/profile/gallery uploads tracked in the DB.
- Move from SQLite to Postgres for multi-instance horizontal scale.
