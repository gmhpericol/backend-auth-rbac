Backend API – User, Contract & Subscription Management

Backend REST API scris în TypeScript, construit pe Express + Prisma, care oferă:

autentificare JWT

Role-Based Access Control (RBAC)

management de utilizatori (soft delete)

management de contracte și subscripții

logică inițială de billing

audit logging pentru acțiuni sensibile

Proiectul este orientat spre design de domeniu, separare clară a responsabilităților și bune practici de securitate.

🔧 Tech Stack

Node.js + Express

TypeScript

Prisma ORM

PostgreSQL (Neon)

JWT Authentication

Zod – validare input

Helmet + Rate Limiting – hardening securitate

Vitest – testare service-level

🧱 Arhitectură

Aplicația urmează o arhitectură stratificată, cu responsabilități clare:

┌─────────────┐
│  Controller │  ← HTTP / REST / Validation
└──────┬──────┘
       ↓
┌─────────────┐
│   Service   │  ← Business Logic + RBAC + Audit
└──────┬──────┘
       ↓
┌─────────────┐
│ Repository  │  ← Database Access (Prisma)
└──────┬──────┘
       ↓
┌─────────────┐
│ PostgreSQL  │
└─────────────┘

Principii

separare clară a responsabilităților

fără logică de business în controllers

repository layer fără reguli de business

service layer ca sursă unică de adevăr

👤 Users vs Customers

User reprezintă un actor autenticat în sistem (ADMIN / MANAGER / USER).

Customer reprezintă entitatea care deține Contracte și Subscriptions.

În versiunea curentă:

customerId este un identificator generic (string)

poate reprezenta un User sau o entitate externă

designul permite extindere ulterioară către Organization / Company

Lifecycle-ul Userului este independent de lifecycle-ul Contractelor și Subscriptions.

🔐 Autentificare & RBAC
JWT Authentication

JWT conține:

userId

role

Tokenul este verificat în middleware

req.user este normalizat intern

Roluri

USER – acces limitat

ADMIN – poate gestiona USER și ADMIN

MANAGER – rol suprem

Reguli RBAC

MANAGER poate administra toate rolurile

ADMIN nu poate modifica MANAGER

USER are acces strict limitat

🔄 User Lifecycle (Soft Delete)

Nu se folosește delete fizic prin API.

Stări

active = true → user activ

active = false → user dezactivat

Operații

Deactivate user (DELETE /users/:id)

Reactivate user (PATCH /users/:id/reactivate)

Ambele:

sunt idempotente

sunt auditate

respectă RBAC

Dezactivarea unui user nu afectează contractele sau billingul.

📄 Contract Management

Contractul reprezintă un acord între sistem și un customer.

Stări contract

DRAFT

ACTIVE

SUSPENDED

TERMINATED

EXPIRED

Reguli

doar contractele ACTIVE pot avea subscriptions active

contractele au lifecycle propriu, independent de user

🔁 Subscription Management

Subscription definește relația activă dintre un Contract și un Plan.

Stări subscription

ACTIVE

PAUSED

CANCELED

EXPIRED

Funcționalități

creare subscription

pauză / reluare

schimbare plan

urmărire billing cycle

calcul nextBillingAt și lastBilledAt

💳 Billing (Initial Logic)

Sistemul implementează o primă versiune de billing automat:

billing per subscription

billing pe cycle (MONTHLY / YEARLY)

generare de invoice per perioadă

protecție împotriva dublării prin billingKey

Billingul este:

determinist

idempotent la nivel de perioadă

separat de autentificare și RBAC

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

scris exclusiv din service layer

accesibil doar MANAGER

📡 Endpoints principale
Auth

POST /auth/register

POST /auth/login

Users

GET /users

PATCH /users/:id/role

DELETE /users/:id

PATCH /users/:id/reactivate

Contracts & Subscriptions

CRUD contracte

creare și administrare subscriptions

schimbare plan

Audit

GET /audit (MANAGER only)

🛡️ Hardening Securitate

Helmet (HTTP headers)

Rate limiting

Centralized error handling

Zod validation

Fără expunere de detalii interne

🗄️ Database & Migrations

PostgreSQL (Neon)

Prisma schema ca sursă de adevăr

migrations versionate în Git

deploy automat:

prisma generate

prisma migrate deploy

▶️ Rulare locală
npm install
npm run dev

Build & Run
npm run build
npm start

🧠 Decizii de design

soft delete pentru User

lifecycle separat pentru User / Contract / Subscription

audit pentru acțiuni critice

business logic concentrat în service layer

middleware pentru normalizare auth

DB provider agnostic (ușor de mutat între provideri)

🎯 Status

✔ Auth
✔ RBAC
✔ Audit
✔ Soft delete + Reactivate
✔ Contract Management
✔ Subscription Management
✔ Initial Billing Logic
✔ Production deploy