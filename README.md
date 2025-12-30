**Backend API – User Management & RBAC
**
Backend REST API scris în TypeScript, construit pe Express + Prisma, cu autentificare JWT, Role-Based Access Control (RBAC) și audit logging pentru acțiuni sensibile.

🔧 Tech Stack

Node.js + Express

TypeScript

Prisma ORM

PostgreSQL (Neon)

JWT Authentication

Zod – validare input

Helmet + Rate Limit – hardening securitate

🧱 Arhitectură

Aplicația urmează o arhitectură stratificată, cu responsabilități clare:

┌─────────────┐
│  Controller │  ← HTTP / REST / Validation
└──────┬──────┘
       ↓
┌─────────────┐
│   Service   │  ← Business Logic + Audit
└──────┬──────┘
       ↓
┌─────────────┐
│ Repository  │  ← Database Access (Prisma)
└──────┬──────┘
       ↓
┌─────────────┐
│ PostgreSQL  │
└─────────────┘

Separare de responsabilități

Controller: HTTP, parsing request, Zod validation

Service: reguli de business, RBAC, audit

Repository: acces DB, fără logică

Middleware: auth, roluri, protecții

🔐 Autentificare & Securitate

JWT-based authentication

Token conține:

userId

role

Token verificat în middleware

req.user normalizat intern

Roluri

USER

ADMIN

MANAGER

Reguli RBAC

MANAGER → rol suprem

ADMIN:

poate gestiona USER / ADMIN

nu poate modifica MANAGER

USER:

acces limitat

🔄 Lifecycle User (Soft Delete)

Nu se folosește delete fizic prin API.

Stări

active = true → user activ

active = false → user dezactivat (soft delete)

Operații

Deactivate user (DELETE /users/:id)

Reactivate user (PATCH /users/:id/reactivate)

Ambele:

sunt auditate

sunt idempotente

respectă RBAC

🧾 Audit Log

Acțiunile administrative sunt auditate într-o tabelă separată:

AuditLog

actorUserId

targetUserId

action

oldValue

newValue

createdAt

Acțiuni auditate

CHANGE_ROLE

DEACTIVATE_USER

REACTIVATE_USER

Auditul este:

append-only

scris din service layer

accesibil doar MANAGER

📡 Endpoints principale
Auth
POST /auth/register
POST /auth/login

Users
GET    /users
PATCH  /users/:id/role
DELETE /users/:id
PATCH  /users/:id/reactivate

Audit
GET /audit   (MANAGER only)

🛡️ Hardening Securitate

Helmet (HTTP headers)

Rate limiting

Centralized error handling

Zod validation

Fără expunere detalii interne

🗄️ Database & Migrations

PostgreSQL (Neon)

Prisma schema ca sursă de adevăr

Migrations versionate în Git

Deploy automat:

prisma generate
prisma migrate deploy

▶️ Rulare locală
npm install
npm run dev

Build & Run
npm run build
npm start

🧠 Decizii de design

Soft delete în loc de delete fizic

Audit pentru acțiuni critice

Service layer conține business logic

Middleware normalizează JWT payload

Provider DB agnostic (Supabase → Neon fără schimbări de cod)

🎯 Status

✔ Auth
✔ RBAC
✔ Audit
✔ Soft delete + Reactivate
✔ Production deploy
