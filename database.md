🗄️ Database Schema (Backend-Agnostic)

Even as a frontend dev, knowing DB design is a big plus 💪
This schema is normalized, scalable, and realistic.

👤 users
users (
  id            UUID (PK),
  name          VARCHAR,
  email         VARCHAR UNIQUE,
  password_hash VARCHAR,
  created_at    TIMESTAMP
)

🏢 workspaces
workspaces (
  id          UUID (PK),
  name        VARCHAR,
  owner_id   UUID (FK → users.id),
  created_at TIMESTAMP
)

👥 workspace_members
workspace_members (
  id            UUID (PK),
  workspace_id UUID (FK → workspaces.id),
  user_id      UUID (FK → users.id),
  role         ENUM('owner', 'member'),
  joined_at    TIMESTAMP
)

📋 boards
boards (
  id           UUID (PK),
  workspace_id UUID (FK → workspaces.id),
  name         VARCHAR,
  created_at   TIMESTAMP
)

🧱 lists
lists (
  id        UUID (PK),
  board_id UUID (FK → boards.id),
  title    VARCHAR,
  position INTEGER
)

🃏 cards
cards (
  id          UUID (PK),
  list_id    UUID (FK → lists.id),
  title       VARCHAR,
  description TEXT,
  priority    ENUM('low', 'medium', 'high'),
  due_date    DATE,
  position    INTEGER,
  created_at  TIMESTAMP
)

🔗 Entity Relationships (Simple View)
User
 └─ Workspace
     └─ Board
         └─ List
             └─ Card


This structure:

supports drag & drop (position)

supports multi-workspace users

matches real SaaS products

🧠 Frontend Mapping (Very Important)
Entity	Frontend Tool
users	Zustand (auth state)
workspaces	TanStack Query
boards	TanStack Query
lists	TanStack Query
cards	TanStack Query
UI state	Zustand