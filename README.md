# Full-Stack Assignment – React + Node.js + MongoDB

This project is a **full-stack web application** built as part of the Frontend Developer Assignment.  
It includes a modern React frontend (Vite + TailwindCSS) and a Node.js/Express backend with MongoDB Atlas.  

---

##  Features

### Frontend (React + Vite + TailwindCSS v4)
- Responsive UI with modern design.
- **Authentication**: Signup & Login forms with Zod + React Hook Form validation.
- **Protected Routes**: Dashboard and Tasks accessible only after login.
- **Dashboard**: Displays logged-in user profile.
- **Tasks Module**:
  - Create, Read, Update (toggle status), Delete tasks.
  - Search & Filter by status (all, pending, done).
- State managed via React Context API.
- API integration using Axios.

### Backend (Node.js + Express + MongoDB Atlas)
- **Authentication**: JWT-based login system.
- **Password Security**: Hashed with bcrypt.
- **Profile APIs**: Fetch & update user details.
- **Tasks APIs**: Full CRUD operations with query-based search/filter.
- **Validation**: Request validation using Zod.
- **Middleware**: JWT authentication for protected routes.
- **Scalable Structure**: Routes, models, middleware, utils split into separate files.

### Security
- JWT authentication.
- Bcrypt password hashing.
- CORS enabled.
- Input validation with Zod.

---

##  Tech Stack

- **Frontend:** React, Vite, TailwindCSS v4, Axios, React Hook Form, Zod  
- **Backend:** Node.js, Express, MongoDB Atlas, JWT, bcrypt, dotenv, cors, zod  
- **Database:** MongoDB Atlas (Cloud)  
- **Dev tools:** Nodemon  

---

##  Project Structure

project-root/
 frontend/ # React + Vite + Tailwind
 backend/ # Express + MongoDB


**Backend structure:**


backend/
 src/
 server.js
 app.js
 config/db.js
 middleware/auth.js
 models/User.js
 models/Task.js
 routes/auth.routes.js
 routes/profile.routes.js
 routes/tasks.routes.js
 utils/validators.js

 # 2. Backend

cd backend
npm install
cp .env.example .env
# Fill the following in .env:
# PORT=4000
# MONGO_URI=<your MongoDB Atlas URI>
# JWT_SECRET=<your-secret>
npm run dev

Backend runs at http://localhost:4000

# 3. Frontend

cd frontend
npm install
echo "VITE_API_URL=http://localhost:4000/api" > .env
npm run dev

Frontend runs at http://localhost:5173

# API Testing (Postman)

Import the collection:

postman/assignment.postman_collection.json


Endpoints:

POST /api/auth/signup

POST /api/auth/login

GET /api/profile

PUT /api/profile

GET /api/tasks

POST /api/tasks

PUT /api/tasks/:id

DELETE /api/tasks/:id

# Scaling Notes

If deployed to production, app can be improved with:

Dockerized deployment.

CI/CD pipeline (GitHub Actions + Vercel/Render).

Rate limiting & Helmet for stronger security.

Refresh tokens & role-based auth.

Database indexing + pagination for tasks.

Environment-specific configs (dev/staging/prod)

# Author

Vaibhav Chaudhary

Email: vaibhavchaudhary8181@gmail.com

GitHub: Vaibhavchaudhary06

LinkedIn: https://www.linkedin.com/in/vaibhavfounderqura/

# Roadmap & Productionization Plan 

# 1 Architecture & Environments

Mono-repo (frontend + backend) abhi ok; prod me Docker + docker-compose.

Separate envs: dev / staging / prod.

Config via env files + secrets manager (Render/Railway/Vercel/Cloudflare).

docker-compose.yml (starter)

version: "3.9"
services:
  api:
    build: ./backend
    ports: ["4000:4000"]
    env_file: ./backend/.env
    depends_on: [mongo]
  web:
    build: ./frontend
    ports: ["5173:5173"]
    environment:
      - VITE_API_URL=http://localhost:4000/api
  mongo:
    image: mongo:7
    ports: ["27017:27017"]
    volumes: [mongo:/data/db]
volumes: { mongo: {} }

# 2 Security Hardening

Helmet + Rate limit + CORS allowlist.

Rotate JWT secret; move to refresh tokens (short-lived access, long-lived refresh).

Validate inputs (Zod already), sanitize (Mongo injection guards).

Express hardening

import helmet from "helmet";
import rateLimit from "express-rate-limit";

app.use(helmet());
app.use(rateLimit({ windowMs: 15*60*1000, limit: 200 })); // 200 req / 15min / IP
app.use(cors({ origin: ["https://your-frontend.com"], credentials: true }));


Refresh token flow (sketch)

POST /auth/login → set refreshToken httpOnly cookie; return accessToken (5–15 min).

POST /auth/refresh → verify refresh, issue new access.

POST /auth/logout → invalidate refresh (DB/redis).

# 3 Performance & Scale

Indexes: tasks by user + createdAt, optional text index on title.

taskSchema.index({ user: 1, createdAt: -1 });
taskSchema.index({ title: "text" }); // or regex-based search stays fine for small data


Pagination on list endpoints (?limit=20&cursor=).

Caching hot reads with Redis (profile or common queries).

CDN for static assets (Vercel/Cloudflare).

# 4 Observability

Structured logs (pino/winston), request IDs.

Error monitoring: Sentry.

Health & readiness probes: /api/health, /api/ready.

app.get("/api/ready", async (_, res) => {
  const ok = !!mongoose.connection.readyState;
  res.status(ok ? 200 : 500).json({ db: ok });
});

# 5 CI/CD

GitHub Actions: lint + test on PR; auto deploy on main to staging.

Frontend → Vercel; Backend → Render/Railway/Fly.io.

.github/workflows/ci.yml (mini)

name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci --prefix backend && npm ci --prefix frontend
      - run: npm test --prefix backend --if-present
      - run: npm run build --prefix frontend

# 6 Data & Migrations

Mongoose migration tool (migrate-mongo) for schema changes.

Backups via Atlas snapshots; seed scripts for staging.

# 7 Testing

Unit: Vitest/Jest (backend services + validators).

Integration: Supertest for APIs.

E2E (optional): Playwright/Cypress for auth + tasks flow.

// example supertest
import request from "supertest";
import app from "../src/app.js";
it("health ok", async () => {
  const res = await request(app).get("/api/health");
  expect(res.status).toBe(200);
});

# 8 Frontend DX & UX

Component library (shadcn/ui or Headless UI) for consistency.

React Query for caching + retries of API calls.

Form: RHF + Zod already; add toasts (sonner) for rich feedback.

Accessibility: focus states, labels, aria attributes (already aligned).

i18n (future): react-i18next scaffolding.

# 9 Cost & Limits

Start with Atlas M0, Render free for API (or Railway), Vercel hobby for web.

Add usage logs + feature flags (Unleash/GrowthBook) as team grows.

 API Contract (stable & versioned)

Prefix with /api/v1/* (future breaking changes = /v2).

Consistent error shape:

{ "message": "error message", "code": "BAD_REQUEST", "details": [] }

 Backlog (Next sprints)

 Refresh token rotation + revoke list (Redis).

 Rate limit per route + IP + user.

 Task attachments & tags; server-side pagination.

 React Query + optimistic updates on Tasks.

 Docker images & one-click compose for local dev.

 Sentry + request tracing (OpenTelemetry) in API.

 ##  Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Tasks
![Tasks](screenshots/tasks.png)

