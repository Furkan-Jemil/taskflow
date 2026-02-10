🛠️ System Overview
📌 System Description

A multi-tenant SaaS task management frontend where users can:

create workspaces

manage boards

organize tasks using lists & cards

collaborate visually with a modern UI

The system follows clean separation of concerns:

Client state → Zustand

Server state → TanStack Query

Navigation → React Router v6

🧱 High-Level Architecture
[ React UI ]
     |
     |  (Axios / Fetch)
     v
[ API Layer ]
     |
     v
[ Backend / Mock API ]
     |
     v
[ Database ]


Frontend focuses on:

UI/UX

state management

routing

optimistic updates

scalability

🎯 Goals (What This Project AIMS to Do)
✅ Primary Goals

1️⃣ Demonstrate advanced React skills

component architecture

hooks

routing

performance awareness

2️⃣ Show correct state separation

Zustand → UI & auth

TanStack Query → remote data

3️⃣ Simulate a real SaaS product

workspaces

boards

permissions-ready design

4️⃣ Be portfolio & interview ready

clean code

TypeScript everywhere

scalable folder structure

5️⃣ Frontend-first mindset

backend can be mocked

focus on UX & data flow

🚫 Non-Goals (What This Project Will NOT Focus On)

These are intentionally out of scope 👇

❌ Real-time sync (WebSockets)
❌ Complex backend business logic
❌ Payment & billing system
❌ Notifications system (email/push)
❌ Advanced RBAC (basic roles only)

💡 These can be added later, but not required to prove frontend expertise.