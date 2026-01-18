Backend API – User, Contract, Subscription & Async Job Scheduling

This project is a production-oriented backend API written in TypeScript, built on Express + Prisma, focused on clean domain design, clear responsibility boundaries, and operational robustness.

In addition to classic REST concerns (Auth, RBAC, Billing), the system includes a custom-built Async Job Scheduler, designed to handle background processing reliably without external queues.

🚀 Core Features
API & Domain

JWT Authentication

Role-Based Access Control (RBAC)

User management with soft delete

Contract lifecycle management

Subscription lifecycle management

Initial deterministic billing logic

Audit logging for sensitive actions

Async Processing

Internal Async Job Scheduler

Background job execution (e.g. emails, async workflows)

Retry with exponential backoff

Crash recovery

Timeout-based recovery

Worker leasing

Graceful shutdown

🔧 Tech Stack

Node.js

Express

TypeScript

Prisma ORM

PostgreSQL (Neon)

JWT Authentication

Zod (input validation)

Helmet + Rate Limiting (security hardening)

Vitest (service-level testing)

Resend (email delivery)

🧱 Architecture

The application follows a layered architecture with strict responsibility separation:

┌─────────────┐
│ Controller  │  ← HTTP / REST / Validation
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

Architectural Principles

Clear separation of concerns

No business logic in controllers

Repositories contain no domain rules

Services are the single source of truth

Domain-first design

Infrastructure kept replaceable

👤 Users vs Customers

User: authenticated system actor (ADMIN, MANAGER, USER)

Customer: entity owning Contracts and Subscriptions

Current design:

customerId is a generic identifier

Can represent a User or an external entity

Allows future extension to Organizations / Companies

User lifecycle is independent from Contract and Subscription lifecycles.

🔐 Authentication & RBAC
JWT Authentication

JWT payload includes:

userId

role

Token is:

verified in middleware

normalized into req.user

Roles

USER – limited access

ADMIN – manages USER and ADMIN

MANAGER – highest privilege

RBAC Rules

MANAGER can manage all roles

ADMIN cannot modify MANAGER

USER has strictly limited access

🔄 User Lifecycle (Soft Delete)

Users are never physically deleted via API.

States

active = true → active user

active = false → deactivated user

Operations

Deactivate user (DELETE /users/:id)

Reactivate user (PATCH /users/:id/reactivate)

All operations are:

idempotent

audited

RBAC-protected

Deactivating a user does not affect contracts or billing.

📄 Contract Management

A Contract represents an agreement between the system and a customer.

Contract States

DRAFT

ACTIVE

SUSPENDED

TERMINATED

EXPIRED

Rules

Only ACTIVE contracts may have active subscriptions

Contract lifecycle is independent of User lifecycle

🔁 Subscription Management

A Subscription represents an active relationship between a Contract and a Plan.

Subscription States

ACTIVE

PAUSED

CANCELED

EXPIRED

Capabilities

Create subscriptions

Pause / resume

Change plan

Track billing cycles

Compute nextBillingAt and lastBilledAt

💳 Billing (Initial Logic)

The system implements an initial version of automated billing:

Billing per subscription

Monthly / yearly cycles

Invoice generation per period

Protection against duplicates using billingKey

Billing is:

deterministic

idempotent per billing period

fully decoupled from authentication & RBAC

🧾 Audit Log

Sensitive administrative actions are recorded in an append-only audit log.

AuditLog Fields

actorUserId

targetUserId

action

oldValue

newValue

createdAt

Audited Actions

CHANGE_ROLE

DEACTIVATE_USER

REACTIVATE_USER

Audit log is:

append-only

written exclusively from the service layer

accessible only to MANAGER

⚙️ Async Job Scheduler

The project includes a custom-built async job scheduler, designed as an internal module (no external queues).

Supported Capabilities

Asynchronous job execution

Job lifecycle management:

PENDING

RUNNING

COMPLETED

FAILED

DEAD

Retry with exponential backoff

Idempotency via jobKey

Execution history & audit trail

🧠 Scheduler Architecture
┌─────────────┐
│ JobService  │  ← Domain rules & orchestration
└──────┬──────┘
       ↓
┌─────────────┐
│ JobExecutor │  ← Business-specific execution
└──────┬──────┘
       ↓
┌─────────────┐
│   Worker    │  ← Polling, leasing, execution
└─────────────┘

🔁 Reliability Mechanisms
Crash Recovery

On startup, jobs left in RUNNING are recovered

Ensures system consistency after process restarts

Timeout-Based Recovery

Jobs running longer than a configured threshold are considered stuck

Automatically failed and retried if possible

Worker Leasing

Jobs are leased to a worker for a limited time

Prevents double execution

Allows safe recovery if a worker stalls or crashes

Graceful Shutdown

Handles SIGTERM / SIGINT

Stops accepting new jobs

Waits for the current job to finish

Releases leases before exit

📡 Main API Endpoints
Auth

POST /auth/register

POST /auth/login

Users

GET /users

PATCH /users/:id/role

DELETE /users/:id

PATCH /users/:id/reactivate

Contracts & Subscriptions

CRUD contracts

Create & manage subscriptions

Change plans

Audit

GET /audit (MANAGER only)

🛡️ Security Hardening

Helmet (secure HTTP headers)

Rate limiting

Centralized error handling

Zod input validation

No internal details exposed to clients

🗄️ Database & Migrations

PostgreSQL (Neon)

Prisma schema as source of truth

Versioned migrations in Git

Production deploy includes:

prisma generate

prisma migrate deploy

▶️ Running Locally
npm install
npm run dev

Build & Run
npm run build
npm start

🧪 Manual API Testing

The API has been manually tested end-to-end using Postman.

Validated flows:

Auth & JWT issuance

RBAC enforcement

User lifecycle (deactivate / reactivate)

Contract lifecycle

Subscription lifecycle

Billing idempotency

Async job execution & recovery

📁 Postman collection:

/postman

🎯 Project Status

✔ Authentication
✔ RBAC
✔ Audit Logging
✔ Soft Delete & Reactivation
✔ Contract Management
✔ Subscription Management
✔ Initial Billing Logic
✔ Async Job Scheduler
✔ Crash Recovery
✔ Timeout Recovery
✔ Worker Leasing
✔ Graceful Shutdown
✔ Production Deployment